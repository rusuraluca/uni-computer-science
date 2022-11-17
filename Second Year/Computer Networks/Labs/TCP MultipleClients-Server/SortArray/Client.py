import socket
import struct
import random
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


def tcp_client_init(ip_address, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((ip_address, port))
    print("You are CONNECTED")
    # client_socket = socket.create_connection(ip_address, port)
    return client_socket


def tcp_connect_client(peer, socket_list):
    (peer_socket, peer_address) = peer.accept()
    socket_list.append(peer_socket)
    print("CONNECTED client: ", peer_address)


def tcp_send_connected_clients(peer, socket_list):
    (peer_socket, peer_address) = peer.accept()
    socket_list.append(peer_socket)
    print("CONNECTED client: ", peer_address)


def tcp_disconnect_client(peer, socket_list):
    print("DISCONNECTED client: ", peer.getpeername())
    socket_list.remove(peer)


def client_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 1233

    client_socket = tcp_client_init(host, port)

    while True:
        arr = []
        x = input('Input floats:')
        while x != '':
            arr.append(float(x))
            x = input('Input floats:')

        if len(arr):
            tcp_send_int(client_socket, len(arr))
            for i in range(len(arr)):
                tcp_send_float(client_socket, arr[i])

            r_len = tcp_recv_int(client_socket)
            for i in range(r_len):
                tcp_recv_float(client_socket)

        else:
            client_socket.close()
            exit(0)


if __name__ == '__main__':
    client_program()
