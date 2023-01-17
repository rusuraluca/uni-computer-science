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


#
# UDP
#
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
    # sock.sendto(string.encode('UTF-8'), dest_addr)


def udp_recv_string(sock):
    string, address = sock.recvfrom(1024)
    converted_string = string.decode('ascii')
    print("Received {data}".format(data=converted_string))
    return converted_string, address


def udp_send_char(sock, char, dest_address):
    print("Sending {data}".format(data=char))
    sock.sendto(char.encode('ascii'), dest_address)
    # sock.sendto(string.encode('UTF-8'), dest_addr)


def udp_recv_char(sock):
    char, address = sock.recvfrom(1)
    converted_char = char.decode('ascii')
    print("Received {data}".format(data=converted_char))
    return converted_char, address


def udp_server_init(ip_address, port):
    # create socket
    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    # bind
    udp_socket.bind((ip_address, port))
    print("UDP Server RUNNING...")
    return udp_socket


def udp_client_init():
    client_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    print("You are CONNECTED")
    return client_socket

    # set up to receive broadcast messages:
    # client_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)



def tcp_worker():

def udp_worker():
def client_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 6014

    try:
        # init & connect client socket
        server_socket = tcp_client_connect(host, port)
        # init udp socket
        udp_socket = udp_client_init()

        # set up to receive broadcast messages
        udp_send_string(udp_socket, 'CONNECTED client!', (host, port))

    except socket.error as msg:
        print('Error: ', msg.strerror)
        exit(-1)

    tcp_thread = threading.Thread(target=tcp_worker, args=(server_socket,))
    udp_thread = threading.Thread(target=udp_worker, args=(udp_socket,))
    tcp_thread.start()
    udp_thread.start()

    print("You are DISCONNECTED")
    server_socket.close()


if __name__ == '__main__':
    client_program()
