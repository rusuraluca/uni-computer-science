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


def reset_server():
    global peer_count, peer_guessed, winner_thread, listener, threads, mylock, e

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
        server_num = round(random.uniform(start, stop), 1)
        print('Server number: ', server_num)

        peer_count = 0
        peer_guessed = False
        winner_thread = 0

        listener = []
        threads = []

        mylock.release()

def worker(peer_socket):
    global peer_count, peer_guessed, winner_thread, listener, threads, mylock, e

    # to het current peer count
    count = peer_count
    print("CONNECTED Client #", peer_count, ' from: ', peer_socket.getpeername(), peer_socket)

    # send meesage to peer
    message = "Hello Client #" + str(peer_count) + "! You are entering the number guessing competition!"
    tcp_send_string(peer_socket, message)


    while not peer_guessed:
        try:
            pass

        except socket.error as msg:
            print('Error:', msg.strerror)

    # if game is over
    if peer_guessed:
        if threading.get_ident() == winner_thread:
            tcp_send_string(peer_socket, 'W')
            print('We have a winner', peer_socket.getpeername())
            print("Client #", count, " winner")
            e.set()
        else:
            tcp_send_string(peer_socket, 'L')
            print("Client #", count, " looser")

    time.sleep(1)
    peer_socket.close()
    print("Game #", count, " ended")




def client_program():
    global  peer_count, peer_guessed, winner_thread, listener, threads, mylock, e

    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5555

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
        listener.append(peer_socket)

        # start client thread
        t = threading.Thread(target=worker, args=(peer_socket,))
        threads.append(t)

        peer_count += 1
        t.start()


if __name__ == '__main__':
    peer_count = 0
    peer_guessed = False
    winner_thread = 0

    listener = []
    threads = []

    mylock = threading.Lock()
    e = threading.Event()
    e.clear()
    client_program()

