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


def str_to_pair(addr):
    pos = None
    for i in range(len(addr)):
        if addr[i] == ':':
            pos = i
    ip = addr[:pos]
    port = int(addr[pos+1:])
    return ip, port


def pair_to_str(addr):
    return "{0}:{1}".format(addr[0], addr[1])


def client_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 7004

    try:
        # init & connect client socket
        server_socket = tcp_client_connect(host, port)

        # init & send udp socket
        udp_socket = udp_client_init()
        # peer_port = int(sys.argv[1])
        peer_port = random.randint(50000, 60000)
        udp_socket.bind((host, peer_port))
        # send the udp port to the server
        tcp_send_int(server_socket, peer_port)

    except socket.error as msg:
        print('Error: ', msg.strerror)
        exit(-1)

    # get peers
    # peers = set()
    # n = tcp_recv_int(server_socket)
    # for _ in range(n):
    #    sz = tcp_recv_int(server_socket)
    #    peers.add(str_to_pair(tcp_recv_string(server_socket, sz)))
    # print('CONNECTED Clients: ', peers)

    finished = False
    random.seed()
    start = 0
    stop = 9
    num_digits = 0
    seen = set()
    seen.add(10)

    num_digits = tcp_recv_int(server_socket)
    tcp_recv_string(server_socket)

    while not finished:
        print('Sending')

        client_digit = 10

        while client_digit in seen:
            client_digit = random.randint(start, stop)

        seen.add(client_digit)

        tcp_send_int(server_socket, client_digit)

        pos = tcp_recv_int(server_socket)
        num_digits -= pos
        tcp_send_int(server_socket, num_digits)

        answer = tcp_recv_int(server_socket)
        if answer != 0:
            finished = True

        time.sleep(3)

    if answer == peer_port:
        print("You are the winner!")
    else:
        print('You lost. The winner is {0}.'.format(answer))

    print("You are DISCONNECTED")
    server_socket.close()


if __name__ == '__main__':
    client_program()
