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


def server_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5552

    # init rendezvous socket
    rndvus_socket = tcp_server_init(host, port)

    # list of sockets
    sockets = [rndvus_socket]

    while True:
        (read, write, err) = select.select(sockets, [], [])
        for peer in read:
            if peer == rndvus_socket:
                tcp_connect_client(peer, sockets)

            else:
                # receive data from client only if data is available
                a = tcp_recv_int(peer)
                b = tcp_recv_int(peer)
                if a and b:
                    s = a + b
                    tcp_send_int(peer, s)

                else:
                    # no message to read => client disconnected
                    tcp_disconnect_client(peer, sockets)


if __name__ == '__main__':
    server_program()
