import socket
import struct
import random
import threading
import time
import sys
import select
import os
from threading import Thread, Lock


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


def get_message(udp_socket):
    message, address = udp_recv_string(udp_socket)
    print(message)


def client_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5010

    try:
        # init rendezvous socket
        server_socket = tcp_client_init(host, port)
        udp_socket = udp_client_init()

    except socket.error as msg:
        print("Error: ", msg.strerror)
        exit(-1)

    t = threading.Thread(target=get_message, args=(udp_socket,))
    t.start()

    finished = False
    random.seed()
    start = 0
    stop = 4
    while not finished:

        x = random.randint(start, stop)
        y = random.randint(start, stop)

        try:
            tcp_send_int(server_socket, x)
            tcp_send_int(server_socket, y)
            tcp_recv_int(server_socket)

        except socket.error as msg:
            print('Error: ', msg.strerror)
            server_socket.close()
            exit(-2)

        time.sleep(3)

    server_socket.close()


if __name__ == '__main__':
    client_program()
