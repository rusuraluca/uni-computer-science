import socket
import struct
import random
import time
import sys
import select
import os


#
# TCP
#


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
    server_socket.listen(10)
    print("TCP Server RUNNING...")
    return server_socket


def tcp_client_init(ip_address, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((ip_address, port))
    print("CONNECTED client: ", client_socket.getpeername())
    # client_socket = socket.create_connection(ip_address, port)
    return client_socket


def tcp_connect_client(rendezvous_socket):
    (peer_socket, peer_address) = rendezvous_socket.accept()
    print("CONNECTED client: ", peer_address)
    return peer_socket, peer_address


def tcp_disconnect_client(peer):
    print("DISCONNECTED client: ", peer.getpeername())


def tcp_client_connect(ip_address, port):
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect((ip_address, port))
    print("You are CONNECTED")
    # client_socket = socket.create_connection(ip_address, port)
    return client_socket


def tcp_client_disconnect(sock):
    print("You are DISCONNECTED")
    sock.close()


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
    server_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    server_socket.bind((ip_address, port))
    print("UDP Server RUNNING...")
    return server_socket


def udp_client_init():
    client_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    return client_socket


def pair_to_str(addr):
    return "{0}:{1}".format(addr[0], addr[1])


def server_program():
    try:
        # as both code is running on same pc
        host = socket.gethostname()
        # socket server port number
        port = 7007

        # init rendezvous socket
        rendezvous_socket = tcp_server_init(host, port)

        udp_socket = udp_client_init()

    except socket.error as msg:
        print('Error: ', msg.strerror)
        exit(-1)

    # client's dictionary:
    # key: tcp socket - used to send the list of clients
    # values: (udp_port - udp communication happens here, ip address - communication)
    clients = set()

    master = [rendezvous_socket]

    while True:
        ready_read, _, _ = select.select(master, [], [])
        for fd in ready_read:
            if fd == rendezvous_socket:
                csock, addr1 = rendezvous_socket.accept()
                cport = tcp_recv_int(csock)
                addr = (addr1[0], cport)
                for client in clients:
                    tcp_send_int(client[0], 0)
                    tcp_send_int(client[0], len(pair_to_str(addr)))
                    tcp_send_string(client[0], pair_to_str(addr))
                tcp_send_int(csock, len(clients))
                for x in clients:
                    tcp_send_int(csock, len(pair_to_str(x[1])))
                    tcp_send_string(csock, pair_to_str(x[1]))
                clients.add((csock, addr))
                master.append(csock)
            else:
                msg = tcp_recv_string(fd)
                cl = None
                for x in clients:
                    if x[0] == fd:
                        cl = x
                if msg == "QUIT":
                    for client in clients:
                        if client != cl:
                            tcp_send_int(client[0], 1)
                            tcp_send_int(client[0], len(pair_to_str(cl[1])))
                            tcp_send_string(client[0], pair_to_str(cl[1]))
                    clients.remove(cl)
                fd.close()
                master.remove(fd)


if __name__ == '__main__':
    server_program()