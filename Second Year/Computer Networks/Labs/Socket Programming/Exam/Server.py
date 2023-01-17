import socket
import struct
import random
import time
import sys
import select
import os
import threading


def tcp_send_int(sock, x):
    print("Sending: {data}".format(data=x))
    sock.send(struct.pack("!i", x))


def tcp_recv_int(sock):
    x = struct.unpack("!i", sock.recv(4))[0]
    print("Received: {data}".format(data=x))
    return x


def tcp_send_string(sock, string):
    print("Sending: {data}".format(data=string))
    sock.send(string.encode('ascii'))


def tcp_recv_string(sock, size=1024):
    string = sock.recv(size).decode('ascii')
    print("Received: {data}".format(data=string))
    return string


def tcp_server_init(ip_address, port):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((ip_address, port))
    server_socket.listen(7)
    print("TCP Server RUNNING...")
    return server_socket


def tcp_client_init(ip_address, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((ip_address, port))
    print("You are CONNECTED")
    return client_socket


def udp_send_int(sock, x, dest_address):
    print("Sending {data}".format(data=x))
    sock.sendto(struct.pack("!i", x), dest_address)


def udp_recv_int(sock):
    number, address = sock.recvfrom(4)
    converted_number = struct.unpack('!i', number)[0]
    print("Received {data}".format(data=converted_number))
    return converted_number, address


def udp_send_string(sock, string, dest_address):
    print("Sending {data}".format(data=string))
    sock.sendto(string.encode('ascii'), dest_address)


def udp_recv_string(sock):
    string, address = sock.recvfrom(1024)
    converted_string = string.decode('ascii')
    print("Received {data}".format(data=converted_string))
    return converted_string, address


def udp_server_init(ip_address, port):
    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_socket.bind((ip_address, port))
    print("UDP Server RUNNING...")
    return udp_socket


def udp_client_init():
    client_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    client_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
    print("You are CONNECTED")
    return client_socket


def udp_worker(sockets, udp_socket):
    global n, matrix, mylock, game_ended, threads, dicovered_treasures, hidden_treasures

    while hidden_treasures > 0:
        for address in sockets:
            udp_send_string(udp_socket, "{0} discovered treasures; {1} hidden treasures".format(dicovered_treasures, hidden_treasures), address)
        time.sleep(3)


def worker(peer_socket):
    global n, matrix, mylock, game_ended, threads, sockets, dicovered_treasures, hidden_treasures

    print('CONNECTED Client', peer_socket.getpeername())

    while hidden_treasures > 0:

        try:
            x = tcp_recv_int(peer_socket)
            y = tcp_recv_int(peer_socket)

            if x > n or y > n or x < 0 or y < 0:
                tcp_send_int(peer_socket, -1)
            elif matrix[x][y] == 0:
                tcp_send_int(peer_socket, 0)
            elif matrix[x][y] == 1:
                tcp_send_int(peer_socket, 1)
                dicovered_treasures += 1
                hidden_treasures -= 1
                matrix[x][y] = 2
            elif matrix[x][y] == 2:
                tcp_send_int(peer_socket, 2)

        except socket.error as msg:
            print('Error:', msg.strerror)

        time.sleep(2)

    peer_socket.close()
    print("Game ended")


def server_program():
    global n, matrix, mylock, game_ended, threads, sockets, dicovered_treasures, hidden_treasures

    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5010

    try:
        tcp_socket = tcp_server_init(host, port)
        udp_socket = udp_server_init(host, port)
    except socket.error as msg:
        print("Error: ", msg.strerror)
        exit(-1)

    while True:
        (peer_socket, peer_address) = tcp_socket.accept()
        sockets.append(peer_address)

        t = threading.Thread(target=worker, args=(peer_socket,))
        threads.append(t)
        t.start()

        t1 = threading.Thread(target=udp_worker, args=(sockets, udp_socket))
        threads.append(t1)
        t1.start()


if __name__ == '__main__':
    n = 5
    random.seed()
    start = 0
    stop = n-1
    matrix = [[0 for x in range(n)] for y in range(n)]
    for i in range(int(n/2)):
        matrix[random.randint(start, stop)][random.randint(start, stop)] = 1

    game_ended = False
    dicovered_treasures = 0
    hidden_treasures = int(n/2)
    sockets = []
    threads = []

    server_program()
