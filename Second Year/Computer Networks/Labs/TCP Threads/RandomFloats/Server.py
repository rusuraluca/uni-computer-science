import socket
import struct
import random
import time
import sys
import select
import os
import threading


def tcp_send_int(sock, x):
	print("Sending: {data}".format(data=x))
	sock.send(struct.pack("!i", x))


def tcp_recv_int(sock):
	x = struct.unpack("!i", sock.recv(4))[0]
	print("Received: {data}".format(data=x))
	return x


def tcp_send_float(sock, x):
	print("Sending: {data}".format(data=x))
	sock.send(struct.pack("!f", x))


def tcp_recv_float(sock):
	x = struct.unpack("!f", sock.recv(4))[0]
	print("Received: {data}".format(data=x))
	return x



def tcp_send_string(sock, string):
	print("Sending: {data}".format(data=string))
	sock.send(string.encode('ascii'))


def tcp_recv_string(sock, size=1024):
	string = sock.recv(size).decode('ascii')
	print("Received: {data}".format(data=string))
	return string


def tcp_send_char(sock, char):
	print("Sending: {data}".format(data=char))
	sock.send(char.encode('ascii'))


def tcp_recv_char(sock):
	char = sock.recv(1).decode('ascii')
	print("Received: {data}".format(data=char))
	return char


def tcp_server_init(ip_address, port):
	server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	server_socket.bind((ip_address, port))
	server_socket.listen(5)
	print("TCP Server RUNNING...")
	return server_socket


def tcp_client_init(ip_address, port):
	client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	client_socket.connect((ip_address, port))
	print("You are CONNECTED")
	# client_socket = socket.create_connection(ip_address, port)
	return client_socket


def tcp_connect_client(peer):
	return peer.accept()


def tcp_disconnect_client(peer, socket_list):
	print("DISCONNECTED client: ", peer.getpeername())
	socket_list.remove(peer)


def worker(peer_socket):
	global e, mylock, peer_count, peer_guessed, winner_thread, server_num, threads, sockets

	count = peer_count
	print("CONNECTED Client #", peer_count, ' from: ', peer_socket.getpeername(), peer_socket)
	message = "HELLO Client #" + str(peer_count) + "! You are entering the number guessing competition!"
	tcp_send_string(peer_socket, message)

	while not peer_guessed:
		try:
			peer_num = tcp_recv_float(peer_socket)
			if abs(server_num - peer_num) <= 0.2:
				mylock.acquire()
				peer_guessed = True
				winner_thread = threading.get_ident()
				mylock.release()
			else:
				tcp_send_string(peer_socket, 'N')

		except socket.error as msg:
			print('Error:', msg.strerror)

	if peer_guessed:
		if threading.get_ident() == winner_thread:
			tcp_send_string(peer_socket, 'W')
			print('We have a winner', peer_socket.getpeername())
			print("Client #", count, " winner")
			e.set()
		else:
			tcp_send_string(peer_socket, 'L')
			print("Client #", count, " looser")

	time.sleep(1)
	peer_socket.close()
	print("Game #", count, " ended")


def reset_server():
	global e, mylock, peer_count, peer_guessed, winner_thread, server_num, threads, sockets

	while True:
		e.wait()
		for t in threads:
			t.join()
		print("All threads are finished.")
		e.clear()

		mylock.acquire()

		random.seed()
		start = 1
		stop = 2 ** 9 - 1
		server_num = round(random.uniform(start, stop), 1)
		print('Server number: ', server_num)

		peer_count = 0
		peer_guessed = False
		winner_thread = 0

		sockets = []
		threads = []

		mylock.release()


def server_program():
	global e, mylock, peer_count, peer_guessed, winner_thread, server_num, threads, sockets

	try:
		# as both code is running on same pc
		host = socket.gethostname()
		# socket server port number
		port = 1233
		# init rendezvous socket
		rendezvous_socket = tcp_server_init(host, port)
	except socket.error as msg:
		print("Error: ", msg.strerror)
		exit(-1)


	# append in sockets
	sockets = [rendezvous_socket]

	# main server thread
	t = threading.Thread(target=reset_server, daemon=True)
	t.start()

	while True:
		# connect client
		(peer_socket, peer_address) = rendezvous_socket.accept()
		sockets.append(peer_socket)

		# start client thread
		t = threading.Thread(target=worker, args=(peer_socket,))
		threads.append(t)

		peer_count += 1
		t.start()


if __name__ == '__main__':
	random.seed()
	start = 1
	stop = 2 ** 9 - 1
	server_num = round(random.uniform(start, stop), 1)
	print('Server number: ', server_num)

	peer_count = 0
	peer_guessed = False
	winner_thread = 0

	sockets = []
	threads = []

	mylock = threading.Lock()
	e = threading.Event()
	e.clear()

	server_program()
