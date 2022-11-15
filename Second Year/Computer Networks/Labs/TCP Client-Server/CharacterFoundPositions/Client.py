# import socket for all socket related primitives
import socket

# we need struct in order to be able to pack data in a stream of bytes
# so that we can actually send an integer as a binary four byte sequence - instead of a string
import struct


def tcp_send_int(sock, x):
    print("Sending {data}".format(data=x))
    sock.send(struct.pack("!I", x))


def tcp_recv_int(sock):
    x = struct.unpack("!I", sock.recv(4))[0]
    print("Received {data}".format(data=x))
    return x


def tcp_send_string(sock, string):
    print("Sending {data}".format(data=string))
    sock.send(string.encode('ascii'))


def tcp_recv_string(sock, size):
    string = sock.recv(size).decode('ascii')
    print("Received {data}".format(data=string))
    return string


def tcp_send_character(sock, string):
    print("Sending {data}".format(data=string))
    sock.send(string.encode('ascii'))


def tcp_recv_character(sock, size):
    string = sock.recv(size).decode('ascii')
    print("Received {data}".format(data=string))
    return string


def tcp_client_init(ip_address, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((ip_address, port))
    return s


def client_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5000

    # instantiate and connect to the TCP socket
    client_socket = tcp_client_init(host, port)
    print("You are CONNECTED")

    while True:
        # give data to send to the server
        string = input('Input string:')
        # send the data to the server
        tcp_send_string(client_socket, string)

        # give data to send to the server
        character = input('Input character:')
        # send the data to the server
        tcp_send_character(client_socket, character)

        # this means client wants to disconnect
        if string == 'OUT' and character == '0':
            break

        # receive the data from server
        no_of_positions = tcp_recv_int(client_socket)
        positions = []
        for no in range(no_of_positions):
            positions.append(tcp_recv_int(client_socket))
        print(positions)

    # close the socket
    client_socket.close()
    print("You are DISCONNECTED")


if __name__ == '__main__':
    client_program()
