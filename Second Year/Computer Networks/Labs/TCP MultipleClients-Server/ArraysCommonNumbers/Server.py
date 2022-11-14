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
        received_n = tcp_recv_string(client_socket)
        list_1 = []
        for i in range(int(received_n)):
            list_1.append(tcp_recv_int(client_socket))

        received_m = tcp_recv_string(client_socket)
        list_2 = []
        for i in range(int(received_m)):
            list_2.append(tcp_recv_int(client_socket))

        # this means we need to disconnect our client
        if received_n == '0' and received_m == '0':
            # close the connection
            break

        else:
            def common(l1, l2):
                l1 = set(l1)
                l2 = set(l2)
                commons = []
                for l in l1:
                    if l in l2:
                        commons.append(l)
                return commons

            commons = common(list_1, list_2)

            # send the data to the client
            tcp_send_int(client_socket, len(commons))
            for com in commons:
                tcp_send_int(client_socket, com)

    # close the connection
    client_socket.close()
    print("DISCONNECTED Client " + str(address))


if __name__ == '__main__':
    server_program()
