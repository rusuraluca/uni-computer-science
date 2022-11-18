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


def tcp_worker(peer_socket):
    tcp_recv_int(peer_socket)
    tcp_send_int(peer_socket, 4)
    time.sleep(2)


def udp_worker(clients, udp_socket):
    for client in clients:
        udp_send_string(udp_socket, 'text', client)
    time.sleep(2)


def reset_server():
    while True:
        e.wait()
        for t in threads:
            t.join()
        print("All threads are finished.")
        e.clear()

        mylock.acquire()
        clients = dict()
        threads = []
        mylock.release()


def server_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 6014

    try:
        # init tcp socket
        tcp_socket = tcp_server_init(host, port)
        # init udp socket
        udp_socket = udp_server_init(host, port)
    except socket.error as msg:
        print("Error: ", msg.strerror)
        exit(-1)

    # main server thread
    t = threading.Thread(target=reset_server, daemon=True)
    t.start()

    while True:
        # connect client
        (peer_socket, peer_address) = tcp_socket.accept()

        received_data, address = udp_recv_string(udp_socket)
        clients.append(address)

        # start client thread
        t = threading.Thread(target=tcp_worker, args=(peer_socket,))
        threads.append(t)

        # start client thread
        t1 = threading.Thread(target=udp_worker, args=(clients, udp_socket))
        threads.append(t1)

        t.start()
        t1.start()


if __name__ == '__main__':
    mylock = threading.Lock()
    e = threading.Event()
    e.clear()
    clients = []
    threads = []
    server_program()
