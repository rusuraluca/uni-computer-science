import socket


def udp_send_string(sock, string, destination_address):
    print("Sending {0}".format(string))
    sock.sendto(string.encode('ascii'), destination_address)


def udp_recv_string(sock):
    string, address = sock.recvfrom(128)
    converted_string = string.decode('ascii')
    print("Received {0}".format(converted_string))
    return converted_string, address


def udp_server_init(ip_addr, port):
    # create socket
    udp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
    # bind
    udp_socket.bind((ip_addr, port))
    return udp_socket


# socket
udp_socket = udp_server_init('0.0.0.0', 1234)

print("UDP Server running")

while True:
    # receive data
    received_data, address = udp_recv_string(udp_socket)

    udp_send_string(udp_socket, received_data, address)

