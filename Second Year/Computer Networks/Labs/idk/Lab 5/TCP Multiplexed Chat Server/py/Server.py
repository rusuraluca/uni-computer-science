import socket
import sys
import select

hello_message = "Hello client! Welcome to the chat!"

tcp_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_STREAM)

listener = []
listener.append(tcp_socket)

tcp_socket.bind(('127.0.0.1', 1234))

tcp_socket.listen(10)


def sendToAll(message):
    for fd in listener[1:]:
        fd.send(message.encode("ascii"))


while True:
    read_fs, _, _ = select.select(listener, [], [])

    for fs in read_fs:
        # handle new connections
        if fs == tcp_socket:
            client_socket, address = tcp_socket.accept()

            listener.append(client_socket)

            client_socket.send(hello_message.encode("ascii"))

        else:
            received_message = fs.recv(1024)

            if not received_message or received_message.decode("ascii") == "QUIT":
                message = 'Client' + str(fs.getpeername()[0]) + ',' + str(fs.getpeername()[1]) + ' : left chat'
                sendToAll(message)

                listener.remove(fs)
                fs.close()

            else:
                message = 'Client' + str(fs.getpeername()[0]) + "," + str(fs.getpeername()[1]) + " : " \
                          + received_message.decode("ascii")
                sendToAll(message)
