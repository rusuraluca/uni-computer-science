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


def tcp_server_init(ip_address, port):
    return socket.create_server((ip_address, port), family=socket.AF_INET, backlog=10, reuse_port=True)


def merge_sort(l1, l2):
    i = 0
    j = 0
    merged_array = []

    while i < len(l1) and j < len(l2):
        if l1[i] < l2[j]:
            merged_array.append(l1[i])
            i += 1
        elif l1[i] > l2[j]:
            merged_array.append(l2[j])
            j += 1
        else:
            merged_array.append(l1[i])
            i += 1
            merged_array.append(l2[j])
            j += 1

    while i < len(l1):
        merged_array.append(l1[i])
        i += 1

    while j < len(l2):
        merged_array.append(l2[j])
        j += 1

    return merged_array


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
        array1_length = tcp_recv_int(client_socket)
        array2_length = tcp_recv_int(client_socket)

        # this means we need to disconnect our client
        if array1_length == 0 and array2_length == 0:
            # close the connection
            break

        else:
            # receive some data from client
            arrays = tcp_recv_string(client_socket)

            # send the data to the client
            array1 = []
            array2 = []

            i = 0
            for ch in arrays:
                if i < array1_length:
                    array1.append(ch)
                else:
                    array2.append(ch)
                i += 1

            merged_array = merge_sort(array1, array2)

            for i in range(len(merged_array)):
                tcp_send_string(client_socket, merged_array[i])

    # close the connection
    client_socket.close()
    print("DISCONNECTED Client " + str(address))


if __name__ == '__main__':
    server_program()
