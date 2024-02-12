import asyncio
import json
from flask_cors import CORS
from threading import Thread

import websockets
from flask import Flask, request

from db_utils import *

app = Flask(__name__)

debug = True

CORS(app)

CLIENTS = set()


@app.route("/", methods=['GET'])
def check():
    return "SUCCESS"


@app.route("/records", methods=['GET'])
def get_records():
    conn = sql_connection()
    records = get_records_db(conn)
    conn.close()

    records_json = [record.as_dict() for record in records]

    return json.dumps({'records': records_json})


@app.route("/record/sync", methods=['POST'])
def records_sync():
    conn = sql_connection()
    records = get_records_db(conn)

    records_json = json.loads(request.data)

    print(records_json)

    for record_id in json.loads(records_json['deleted_ids']):
        print(record_id)
        delete_record_db(conn, record_id)

    for record_json in json.loads(records_json['updated_records']):
        print(record_json)
        update_record_db(conn, Record(int(record_json["id"]), record_json["title"], record_json["artist"], record_json["genre"], record_json["releaseYear"], record_json["dateAcquired"], record_json["cover"]))

    records_to_add = []
    for record_json in json.loads(records_json['records']):
        found = False
        for record in records:
            if record_json['title'] == record.title \
                    and record_json['artist'] == record.artist \
                    and record_json['genre'] == record.genre \
                    and record_json['releaseYear'] == record.releaseYear \
                    and record_json['dateAcquired'] == record.dateAcquired \
                    and record_json['cover'] == record.cover:
                found = True
            elif record_json['id'] == record.id:
                found = True
        if not found:
            records_to_add.append(
                Record(record_json['title'], record_json['artist'], record_json['genre'], record_json['releaseYear'], record_json['dateAcquired'], record_json['cover']))

    for record in records_to_add:
        add_record_db(conn, record)

    records = get_records_db(conn)
    conn.close()

    records_json = [record.as_dict() for record in records]

    return json.dumps({'records': records_json})


@app.route("/record/<id>", methods=['GET'])
def get_record(id):
    conn = sql_connection()
    record = get_record_db(conn, id)
    conn.close()

    if record is None:
        return "ERROR"

    return json.dumps(record.as_dict())


@app.route("/record", methods=['POST'])
def add_record():
    request_data_str = request.data.decode("utf-8")
    record_json = json.loads(request_data_str)
    conn = sql_connection()
    record = add_record_db(conn, Record(0, record_json['title'], record_json['artist'], record_json['genre'], record_json['releaseYear'], record_json['dateAcquired'], record_json['cover']))
    conn.close()

    record_json['id'] = record.id
    # Convert the updated data back to a JSON string
    updated_data_json_str = json.dumps(record_json)

    # Broadcasting the new JSON string with the 'id'
    asyncio.run(broadcast("ADD$" + updated_data_json_str))

    return "SUCCESS"


@app.route("/record", methods=['PUT'])
def update_record():
    record_json = json.loads(request.data)
    conn = sql_connection()
    update_record_db(conn, Record(int(record_json['id']), record_json['title'], record_json['artist'], record_json['genre'], record_json['releaseYear'], record_json['dateAcquired'], record_json['cover']))
    conn.close()

    asyncio.run(broadcast("UPDATE$" + str(request.data, "UTF-8")))

    return "SUCCESS"


@app.route("/record/<id>", methods=['DELETE'])
def delete_record(id):
    conn = sql_connection()
    delete_record_db(conn, id)
    conn.close()

    asyncio.run(broadcast("DELETE$" + id))

    return "SUCCESS"


async def send(websocket, message):
    try:
        await websocket.send(message)
    except websockets.ConnectionClosed:
        CLIENTS.remove(websocket)
        pass


async def broadcast(message):
    for websocket in CLIENTS:
        asyncio.create_task(send(websocket, message))


async def echo(websocket):
    CLIENTS.add(websocket)
    try:
        # data = await websocket.recv()
        # print(data)

        await websocket.wait_closed()
    finally:
        CLIENTS.remove(websocket)


async def main_sockets():
    async with websockets.serve(echo, "0.0.0.0", 8765, ssl=None):
        await asyncio.Future()


def routine1():
    asyncio.run(main_sockets(), debug=False)


def routine2():
    app.run(host="0.0.0.0", port=5001, debug=False, threaded=True)


if __name__ == "__main__":
    print("ok")
    thread_web = Thread(target=routine1)
    thread_server = Thread(target=routine2)
    thread_web.start()
    thread_server.start()
    thread_web.join()
    thread_server.join()
