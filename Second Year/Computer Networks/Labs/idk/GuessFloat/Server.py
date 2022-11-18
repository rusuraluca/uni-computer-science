__author__ = 'dadi'

import socket
import threading
import random
import struct
import time
import sys

random.seed()
start = 1
stop = 2**17-1
my_num = random.randint(start, stop)
print('Server number: ', my_num)
mylock = threading.Lock()
client_guessed = False
winner_thread = 0
e = threading.Event()
e.clear()
threads = []
client_count = 0
response_dic = {} # response dictionary

def notify():
    min = float('inf')
    for r in response_dic:
        if abs(my_num - r) < min:
            min = r
            id = [k for k, v in response_dic.items() if v == r][0]
    return id


def worker(cs):
    global mylock, client_guessed, my_num, winner_thread, client_count, e, response_dic, timer

    my_idcount = client_count
    print('client #', client_count, 'from: ' , cs.getpeername(), cs)
    message = 'Hello client #'+str(client_count)+' ! You are entering the number guess competition now!'
    cs.sendall(bytes(message, 'ascii'))

    try:
        cnumber = cs.recv(4)
        response_dic[cs] = cnumber # keep track of the last element
        timer.cancel() # cancel the timer object

        timer = threading.Timer(10, notify)  # configured a timer thread
        timer.start()  # start the timer object
        cnumber = struct.unpack('!I', cnumber)[0]
        if cnumber > my_num:
            cs.sendall(b'S')
        if cnumber < my_num:
            cs.sendall(b'H')
        if cnumber == my_num:
            mylock.acquire()
            client_guessed = True
            winner_thread = threading.get_ident()
            mylock.release()

    except socket.error as msg:
        print('Error:', msg.strerror)

    if client_guessed:
        if threading.get_ident() == winner_thread:
            cs.sendall(b'G')
            print('We have a winner', cs.getpeername())
            print("Thread ", my_idcount, " winner")
            # setting the event => resume the execution of the reset server
            e.set()
        else:
            cs.sendall(b'L')
            print("Thread ", my_idcount, " looser")
    if notify():
        print('We have a winner')
        print("Thread ", notify(), " winner")
        # setting the event => resume the execution of the reset server
        e.set()

    time.sleep(1)
    cs.close()
    print("Worker Thread ", my_idcount, " end")


def resetSrv():
    global mylock, client_guessed, winner_thread, my_num, threads, e, client_count
    while True:
        # wait for all clients
        e.wait()
        for t in threads:
            # waits for all the clients to finish
            t.join()
        print("All threads are finished now")
        # clears the event
        e.clear()
        mylock.acquire()
        threads = []
        client_guessed = False
        winner_thread = -1
        client_count = 0
        my_num = random.randint(start, stop)
        print('Server number: ', my_num)
        mylock.release()

if __name__=='__main__':
    try:
        rs = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        rs.bind(('0.0.0.0', 1234))
        rs.listen(5)
    except socket.error as msg:
        print(msg.strerror)
        exit(-1)

    t = threading.Thread(target=resetSrv, daemon=True)
    t.start()

    while True:
        timer = threading.Timer(10, notify)  # configured a timer thread
        timer.start()  # start the timer object
        client_socket, addrc = rs.accept()
        t = threading.Thread(target=worker, args=(client_socket,))
        threads.append(t)
        client_count += 1
        t.start()
