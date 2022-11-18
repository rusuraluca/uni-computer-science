import socket
import struct
import random
import time
import time
import sys
import select
import threading


def tcp_send_int(sock, x):
    print("Sending: {data}".format(data=x))
    sock.send(struct.pack("!i", x))


def tcp_recv_int(sock):
    x = struct.unpack("!i", sock.recv(4))[0]
    print("Received: {data}".format(data=x))
    return x


def tcp_send_float(sock, x):
    print("Sending: {data}".format(data=x))
    sock.send(struct.pack("!f", x))


def tcp_recv_float(sock):
	x = struct.unpack("!f", sock.recv(4))[0]
	print("Received: {data}".format(data=x))
	return x


def tcp_send_string(sock, string):
    print("Sending: {data}".format(data=string))
    sock.send(string.encode('ascii'))


def tcp_recv_string(sock, size=1024):
    string = sock.recv(size).decode('ascii')
    print("Received: {data}".format(data=string))
    return string


def tcp_send_char(sock, char):
    print("Sending: {data}".format(data=char))
    sock.send(char.encode('ascii'))


def tcp_recv_char(sock):
    char = sock.recv(1).decode('ascii')
    print("Received: {data}".format(data=char))
    return char


def tcp_server_init(ip_address, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((ip_address, port))
    server_socket.listen(7)
    print("TCP Server RUNNING...")
    return server_socket


def tcp_client_connect(ip_address, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((ip_address, port))
    print("You are CONNECTED")
    # client_socket = socket.create_connection(ip_address, port)
    return client_socket


def pair_to_str(addr):
    return "{0}:{1}".format(addr[0], addr[1])


def reset_server():
    global server_num, peer_count, peer_guessed, winner_thread, listener, threads, mylock, e

    while True:
        e.wait()
        for t in threads:
            t.join()
        print("All threads are finished.")
        e.clear()

        mylock.acquire()

        random.seed()
        start = 1
        stop = 2 ** 9 - 1
        server_num = random.randint(start, stop)
        print('Server number: ', server_num)

        peer_count = 0
        peer_guessed = False
        winner_thread = 0

        listener = set()
        threads = []

        mylock.release()


def worker(peer_socket):
    global peer_port, server_num, peer_count, peer_guessed, winner_thread, listener, threads, mylock, e

    # to set current peer count
    count = peer_count
    print("CONNECTED Client #", peer_count, ' from: ', peer_port)

    # send meesage to peer
    message = "Hello Client #" + str(peer_count) + "! You are entering the number guessing competition!"
    tcp_send_string(peer_socket, message)

    while not peer_guessed:
        try:
            peer_digit = tcp_recv_int(peer_socket)

            pos = 0
                for _ in

            tcp_send_int(peer_socket, pos)
            digits_left = tcp_recv_int(peer_socket)

            if digits_left == 0:
                mylock.acquire()
                peer_guessed = True
                winner_thread = threading.get_ident()
                winner_port = peer_port
                mylock.release()

            else:
                tcp_send_int(peer_socket, 0)

        except socket.error as msg:
            print('Error:', msg.strerror)

    if peer_guessed:
        if threading.get_ident() == winner_thread:
            tcp_send_int(peer_socket, winner_port)
            print('We have a winner', winner_port)
            print("Client #", count, " winner")
            e.set()
        else:
            tcp_send_int(peer_socket, winner_port)
            print("Client #", count, " looser")

    time.sleep(1)
    peer_socket.close()
    print("Game #", count, " ended")


def client_program():
    global peer_port, server_num, peer_count, peer_guessed, winner_thread, listener, threads, mylock, e

    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 7004

    try:
        # init & connect client socket
        rendezvous_socket = tcp_server_init(host, port)

    except socket.error as msg:
        print('Error: ', msg.strerror)
        exit(-1)

    # if we reset the server
    t = threading.Thread(target=reset_server, daemon=True)
    t.start()

    while True:
        # connect client
        (peer_socket, peer_address) = rendezvous_socket.accept()
        peer_port = tcp_recv_int(peer_socket)
        address = (peer_address[0], peer_port)
        listener.add((peer_socket, address))
        print("CONNECTED client: ", peer_address)

        # send connected clients to client
        # tcp_send_int(peer_socket, len(listener))
        # for client in listener:
            # send length of pair port and address
            # tcp_send_int(client[0], len(pair_to_str(address)))
            # send pair port and address
            # tcp_send_string(client[0], pair_to_str(address))

        # send number of digits to client
        tcp_send_int(peer_socket, len(str(server_num)))

        # start client thread
        t = threading.Thread(target=worker, args=(peer_socket,))
        threads.append(t)

        peer_count += 1
        t.start()


if __name__ == '__main__':
    random.seed()
    start = 1
    stop = 2 ** 9 - 1
    server_num = random.randint(start, stop)
    print('Server number: ', server_num)

    peer_count = 0
    peer_guessed = False
    winner_thread = 0

    listener = set()
    threads = []

    mylock = threading.Lock()
    e = threading.Event()
    e.clear()
    client_program()

