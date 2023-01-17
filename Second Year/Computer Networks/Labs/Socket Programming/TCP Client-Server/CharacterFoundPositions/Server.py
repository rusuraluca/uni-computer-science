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
    sock.send(string.encode())


def tcp_recv_string(sock):
    string = sock.recv(1024).decode()
    print("Received {data}".format(data=string))
    return string


def tcp_send_character(sock, string):
    print("Sending {data}".format(data=string))
    sock.send(string.encode('ascii'))


def tcp_recv_character(sock):
    string = sock.recv(8).decode('ascii')
    print("Received {data}".format(data=string))
    return string


def tcp_server_init(ip_address, port):
    return socket.create_server((ip_address, port), family=socket.AF_INET, backlog=10, reuse_port=True)


def server_program():
    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 5000

    # connect to the server
    server_socket = tcp_server_init(host, port)

    # configure how many clients the server can listen simultaneously
    server_socket.listen(2)

    print("TCPServer running...")

    # accept new connection
    client_socket, address = server_socket.accept()
    print("CONNECTED Client " + str(address))

    while True:
        # receive some data from client
        received_string = tcp_recv_string(client_socket)
        received_character = tcp_recv_character(client_socket)

        # this means we need to disconnect our client
        if received_string == 'OUT' and received_character == '0':
            # close the connection
            break

        else:
            def positions(string, character):
                posi = []
                for i in range(len(string)):
                    if string[i] == character:
                        posi.append(i)
                return posi

            positions = positions(received_string, received_character)

            # send the data to the client
            tcp_send_int(client_socket, len(positions))
            for pos in positions:
                tcp_send_int(client_socket, pos)

    # close the connection
    client_socket.close()
    print("DISCONNECTED Client " + str(address))


if __name__ == '__main__':
    server_program()
