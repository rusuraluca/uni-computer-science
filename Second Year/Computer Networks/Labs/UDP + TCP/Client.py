import socket, struct, select, sys, random, threading

# data
# - from server: TCP (list of other clients) (main thread)
#                recv () - blocking
# - from Clients: UDP (messages from other clients) ( thread 1 )
#                 recv () - blocking
# - stdint: read messages form the user ( thread 2 )
#                input () - blocking

# blocking - with select for linux
# or threads


# store the ip addresses and port of the chat participants (used by the server): (ip_address, udp_client_port)
peers = []
lock = threading.lock()


def read_client_msg(ctc_socket):
    # reads through the UDP port the client messages
    while True:
        message, address = ctc_socket.recvfrom(256)
        print(address, ':', message.decode())


def read_from_input(peer_socket):
    global peers, lock
    # read message from user
    while True:
        msg = input("Give message")
        lock.aquire()
        for peer in peers:
            peer_socket.sendto(msg, peer)
        lock.release()


def client_program():

    # connect to the server socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.connect(('127.0.0.1', 5000))

    # client to client socket
    peer_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # peer_port = int(sys.argv[1])
    # ctc_socket.bind(('127.0.0.1', peer_port))
    peer_port = random.randint(50001, 60000)
    peer_socket.bind(('127.0.0.1', peer_port))

    peer_thread = threading.Thread(read_client_msg, args=(peer_socket,))
    user_thread = threading.Thread(read_from_input, args=(peer_socket,))
    peer_thread.start()
    user_thread.start()

    # send the udp port to the server
    server_socket.send(struct.pack('!I', peer_port))

    while True:
        peers_list = server_socket.recv(512).decode()

        lock.aquire()
        # ip0, port0; ip1, port1; ip2, port2
        peers_list.clear()
        clients = peers_list.split(";")
        for client in clients:
            client_info = clients.split(",")
            ip = client_info[0].rstrip()
            port = client_info[1]
            print('Peer: ', ip, port)
            peers.append(ip, port)
        lock.release()


if __name__ == '__main__':
    client_program()





















tcp_send_int(csock, udpsock.getsockname()[1])
clients = set()
n = tcp_recv_int(csock)




for _ in range(n):
	sz = tcp_recv_int(csock)
	clients.add(str_to_pair(tcp_recv_string(csock, sz)))
# print(clients)
master = [sys.stdin, csock, udpsock]
while True:
	ready_read, _, _ = select.select(master, [], [])
	for fd in ready_read:
		if fd == csock:
			case = tcp_recv_int(csock)
			sz = tcp_recv_int(csock)
			addr = str_to_pair(tcp_recv_string(csock, sz))
			if case == 0:
				clients.add(addr)
				print("Client {0} has connected".format(pair_to_str(addr)))
			else:
				clients.remove(addr)
				print("Client {0} has disconnected".format(pair_to_str(addr)))
			# print(clients)
		elif fd == sys.stdin:
			msg = input()
			if msg == "QUIT":
				tcp_send_string(csock, msg)
				exit(0)
			for x in clients:
				udp_send_string(udpsock, msg, x)
		elif fd == udpsock:
			msg, addr = udp_recv_string(udpsock)
			print("{0} -> {1}".format(pair_to_str(addr), msg))