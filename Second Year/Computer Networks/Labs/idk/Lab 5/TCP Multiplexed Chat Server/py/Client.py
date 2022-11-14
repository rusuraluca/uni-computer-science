import socket
import sys
import select

client_socket = socket.socket(family=socket.AF_INET, type=socket.SOCK_STREAM)
client_socket.connect(('127.0.0.1', 1234))

# listener = [0, tcp_socket]
listener = [sys.stdin, client_socket]

while True:
    copy_listener = listener

    read_fs, _, _ = select.select(copy_listener, [], [])

    if sys.stdin in read_fs:
        message = input()
        client_socket.send(message.encode("ascii"))
        if message == "QUIT":
            client_socket.close()
            break

        elif client_socket in read_fs:
            data = client_socket.recv(1024).decode("ascii")
            print(data)
