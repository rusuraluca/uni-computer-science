import logging
import sqlite3

from sqlite3 import Error, Connection

from record import Record

logger = logging.getLogger('debugLogger')
logger.setLevel(logging.DEBUG)

def sql_connection() -> Connection:
    try:
        conn = sqlite3.connect("records.db")
        create_records_table(conn)

        return conn
    except Error as e:
        logger.error(f"Failed to connect to database: {e}")
        exit(1)

def create_records_table(conn: Connection):
    curs = conn.cursor()

    curs.execute("""
        CREATE TABLE IF NOT EXISTS Records(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            artist TEXT,
            genre TEXT,
            releaseYear INTEGER,
            dateAcquired TEXT,
            cover TEXT)
    """)

    conn.commit()


def get_records_db(conn: Connection) -> [Record]:
    curs = conn.cursor()

    rows = curs.execute("""
        SELECT * FROM Records;
    """).fetchall()

    records = []
    for row in rows:
        record = Record(int(row[0]), row[1], row[2], row[3], int(row[4]), row[5], row[6])
        records.append(record)

        logger.debug(
            f"get_records_db - Record: {record.id}, {record.title}, {record.artist}, {record.genre}, {record.releaseYear}, {record.dateAcquired}, {record.cover}")

    return records


def get_record_db(conn: Connection, id: int) -> Record:
    curs = conn.cursor()

    rows = curs.execute(f"""
        SELECT * FROM Records WHERE id={id};
    """).fetchall()

    if len(rows) != 1:
        logger.debug(f"More instances with the same id")

        return None

    else:
        record = Record(int(rows[0][0]), rows[0][1], rows[0][2], rows[0][3], int(rows[0][4]), rows[0][5], rows[0][6])
        logger.debug(
            f"get_record_db - Record: {record.id}, {record.title}, {record.artist}, {record.genre}, {record.releaseYear}, {record.dateAcquired}, {record.cover}")

        return record


def add_record_db(conn: Connection, record: Record):
    curs = conn.cursor()

    curs.execute(f"""
        INSERT INTO Records(title, artist, genre, releaseYear, dateAcquired, cover) VALUES(
            '{record.title}',
            '{record.artist}',
            '{record.genre}',
            {record.releaseYear},
            '{record.dateAcquired}',
            '{record.cover}'
        );
    """)

    logger.debug(f"add_record_db - Record: {record.id}, {record.title}, {record.artist}, {record.genre}, {record.releaseYear}, {record.dateAcquired}, {record.cover}")

    conn.commit()

    return record


def update_record_db(conn: Connection, other: Record):
    curs = conn.cursor()

    curs.execute(f"""
        UPDATE Records
        SET
        title = '{other.title}',
        artist = '{other.artist}',
        genre = '{other.genre}',
        releaseYear = {other.releaseYear},
        dateAcquired = '{other.dateAcquired}',
        cover = '{other.cover}'
        WHERE id = {other.id};
    """)

    logger.debug(
        f"update_record_db - Record: {other.id}, {other.title}, {other.artist}, {other.genre}, {other.releaseYear}, {other.dateAcquired}, {other.cover}")

    conn.commit()


def delete_record_db(conn: Connection, record_id: int):
    curs = conn.cursor()

    curs.execute(f"""
        DELETE FROM Records WHERE id={record_id};
    """)

    logger.debug(f"delete_record_db - Record: {record_id}")

    conn.commit()