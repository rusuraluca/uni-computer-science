import socket
import struct
import random


def udp_send_int(sock, x, dest_addr):
    print("Sending {0}".format(x))
    sock.sendto(struct.pack("!i", x), dest_addr)


def udp_recv_int(sock):
    number, addr = sock.recvfrom(4)
    converted_number = struct.unpack('!i', number)[0]
    print("Received {0}".format(converted_number))
    return converted_number, addr


def udp_send_string(sock, string, dest_addr):
    print("Sending {0}".format(string))
    sock.sendto(string.encode('ascii'), dest_addr)
    # sock.sendto(string.encode('UTF-8'), dest_addr)


def udp_recv_string(sock):
    string, addr = sock.recvfrom(1024)
    converted_string = string.decode('ascii')
    print("Received {0}".format(converted_string))
    return converted_string, addr


def udp_server_init(ip_addr, port):
    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    udp_socket.bind((ip_addr, port))
    return udp_socket


def udp_client_init():
    return socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)


def server_program():
    try:
        server_socket = udp_server_init('0.0.0.0', 1234)
    except socket.error as msg:
        print(msg.strerror)
        exit(-1)

    # a set of player's addresses
    players = set()

    while True:
        # receive data from client
        client_number, address = udp_recv_int(server_socket)

        # add client to set
        players.add(address)

        if client_number > my_num:
            udp_send_string(server_socket, 'S', address)
        if client_number < my_num:
            udp_send_string(server_socket, 'H', address)
        if client_number == my_num:
            winner = address
            break

    for address in players:
        print(address)
        if address == winner:
            udp_send_string(server_socket, 'G', address)
        else:
            udp_send_string(server_socket, 'L', address)


if __name__ == '__main__':
    random.seed()
    start = 1
    stop = 2 ** 17 - 1
    my_num = random.randint(start, stop)
    print('Server number: ', my_num)

    server_program()
