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


def tcp_recv_string(sock):
    string = sock.recv(8).decode('ascii')
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
        array1_length = int(input('Length of array 1:'))
        array1 = []
        for i in range(array1_length):
            array_elem = input('Give characters:')
            array1.append(array_elem)

        # give data to send to the server
        array2_length = int(input('Length of array 2:'))
        array2 = []
        for i in range(array2_length):
            array_elem = input('Give characters:')
            array2.append(array_elem)

        # send some data to the server
        tcp_send_int(client_socket, array1_length)
        tcp_send_int(client_socket, array2_length)

        # this means clients wants to disconnect
        if array1_length == 0 and array2_length == 0:
            break

        # send some data to the server
        for i in range(array1_length):
            tcp_send_string(client_socket, array1[i])

        for i in range(array2_length):
            tcp_send_string(client_socket, array2[i])

        # receive the data from server
        tcp_recv_string(client_socket)

    # close the socket
    client_socket.close()
    print("You are DISCONNECTED")


if __name__ == '__main__':
    client_program()

