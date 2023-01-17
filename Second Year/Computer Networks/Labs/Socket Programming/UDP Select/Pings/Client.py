import socket
import time


def udp_send_string(sock, string, destination_address):
    print("Sending {0}".format(string))
    sock.sendto(string.encode('ascii'), destination_address)


def udp_recv_string(sock):
    string, address = sock.recvfrom(128)
    converted_string = string.decode('ascii')
    print("Received {0}".format(converted_string))
    return converted_string, address


def udp_client_init():
    return socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)


# create socket
udp_socket = udp_client_init()

# set up to receive broadcast messages
udp_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

for i in range(0, 4):
    # timer starts
    begin = time.time()

    # data to send
    message = 'Message'

    # send data
    # message.encode("UTF-8")
    # or
    # b'A client here'
    udp_send_string(udp_socket, message, ('0.0.0.0', 1234))

    # receive data
    received_data, address = udp_recv_string(udp_socket)

    # timer ends
    end = time.time()

    if received_data == message:
        print("Same message")
    else:
        print("{0} differs from {1}".format(message, received_data))

    print("It took {0} seconds".format(end-begin))
