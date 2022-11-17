import socket
import struct
import random
import time


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


def client_program():
    # create socket
    try:
        client_socket = udp_client_init()
    except socket.error as msg:
        print("Error: ", msg.strerror)
        exit(-1)

    # when to stop
    finished = False
    step_count = 0
    random.seed()
    start = 1
    stop = 2 ** 17 - 1

    while not finished:
        my_num = random.randint(start, stop)
        try:
            udp_send_int(client_socket, my_num, ('0.0.0.0', 1234))
            ans = client_socket.recvfrom(1)[0]
        except socket.error as msg:
            print('Error: ', msg.strerror)
            client_socket.close()
            exit(-2)
        step_count += 1
        print('Sent: ', my_num, ' Answer: ', ans)
        if ans == b'H':
            start = my_num
        if ans == b'S':
            stop = my_num
        if ans == b'G' or ans == b'L':
            finished = True
        time.sleep(0.25)

    client_socket.close()
    if ans == b'G':
        print("You are the winner with", my_num, "in", step_count, "steps")
    else:
        print("You lost!")


if __name__ == '__main__':
    client_program()

