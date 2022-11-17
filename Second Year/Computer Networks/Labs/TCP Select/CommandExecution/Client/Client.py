#import socket for all socket related primitives
import socket

# we need struct in order to be able to pack data in
# a stream of bytes so that we can actually send
# an integer as a binary four byte sequence - instead
# of a string
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
    string = sock.recv(1024).decode('ascii')
    print("Received {data}".format(data=string))
    return string


def tcp_client_init(ip_address, port):
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.connect((ip_address, port))
    return s


def client_program():
    cmd = input('command=')

    # as both code is running on same pc
    host = socket.gethostname()
    # socket server port number
    port = 4321

    # instantiate and connect to the TCP socket
    client_socket = tcp_client_init(host, port)
    print("You are CONNECTED")

    for x in cmd:
        # send command char by char
        client_socket.send(struct.pack("c", x.encode("ascii")))
    # end of command
    client_socket.send(struct.pack("c", '\0'.encode("ascii")))

    while True:
        c = client_socket.recv(1).decode('ascii')
        if c == '\0':
            break
        print(c, end="")

    c = client_socket.recv(4)
    c = struct.unpack('!i', c)
    print("The exit code is {0}.".format(c[0].__format__('d')))
    client_socket.close()


if __name__ == '__main__':
    client_program()