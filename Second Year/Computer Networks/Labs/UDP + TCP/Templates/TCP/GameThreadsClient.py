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


def tcp_client_connect(ip_address, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((ip_address, port))
    print("You are CONNECTED")
    # client_socket = socket.create_connection(ip_address, port)
    return client_socket


def client_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5555

    try:
        # init & connect client socket
        client_socket = tcp_client_connect(host, port)

    except socket.error as msg:
        print('Error: ', msg.strerror)
        exit(-1)

    finished = False
    random.seed()
    start = 1
    stop = 2 ** 9 - 1

    # tcp_recv_string(client_socket)

    step_count = 0

    while not finished:
        client_num = round(random.uniform(start, stop), 1)

        try:
            tcp_send_float(client_socket, client_num)
            answer = tcp_recv_string(client_socket)
        except socket.error as msg:
            print('Error: ', msg.strerror)
            client_socket.close()
            exit(-2)

        step_count += 1

        print('Answer: ', answer)
        if answer == 'W' or answer == 'L':
            finished = True

        time.sleep(3)

    if answer == 'W':
        print("You are the winner with ", client_num, " in ", step_count, " steps.")
    elif answer == 'L':
        print("You lost.")

    print("You are DISCONNECTED")
    client_socket.close()


if __name__ == '__main__':
    client_program()
