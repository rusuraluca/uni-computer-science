import socket
import struct
import random
import time
import time
import sys
import select


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


def server_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5555

    try:
        # init rendezvous socket
        rendezvous_socket = tcp_server_init(host, port)

    except socket.error as msg:
        print('Error: ', msg.strerror)
        exit(-1)

    # list of sockets
    listener = [rendezvous_socket]

    while True:
        (read, write, err) = select.select(listener, [], [])
        for peer in read:
            if peer == rendezvous_socket:
                try:
                    (peer_socket, peer_address) = rendezvous_socket.accept()
                    print("CONNECTED client: ", peer_address)
                    listener.append(peer_socket)
                except socket.error as msg:
                    print('Error: ', msg.strerror)
                    exit(-2)

            else:
                # receive data from peer

                if data is ok:

                # handle request

                # send data to peer

                else:
                    print("DISCONNECTED client: ", peer.getpeername())
                    listener.remove(peer)


if __name__ == '__main__':
    server_program()
