import socket
import sys
import os
import threading
import time
from datetime import datetime
import texttable
import re
UDP_Port = 7777
connectionTuple = (sys.argv[1], UDP_Port)
peers = []
count = {}
malformed = []


def safePrint(msg):
    global lock
    with lock:
        print(msg)


def hash(addr):
    return str(addr[0]) + ":" + str(addr[1])


def unhash(addr):
    arr = addr.split(":")
    return arr[0], int(arr[1])


class ClientThread(threading.Thread):
    def __init__(self, value):
        super(ClientThread, self).__init__(name="Client thread " + str(value))
        self.val = value
        try:
            self.clientSock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
            self.clientSock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
            self.clientSock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            self.clientSock.settimeout(1)
        except socket.error as msg:
            print("Error: ", msg.strerror)
            exit(-1)

    def run(self):
        startTime = time.time()
        global malformed, connectionTuple
        while True:
            currentTime = time.time()
            try:
                data, addr = self.clientSock.recvfrom(1024)
                data = data.decode('ascii').strip()
                if data == "Go close yourself":
                    safePrint("Closing " + self.name)
                    self.clientSock.close()
                    exit(0)
                else:
                    r = re.compile('TIME .{2}:.{2}:.{2}')
                    r2 = re.compile('DATE .{2}:.{2}:.{4}')
                    if r.match(data) or r2.match(data):
                        safePrint(self.name + " received: " + data)
                    else:
                        malformed.append([hash(connectionTuple), data])

                time.sleep(1)
            except socket.error as msg:
                if msg.strerror is not None and msg.strerror != "timed out":
                    print("Error:", msg.strerror)
            if int(currentTime - startTime) % 3 == 0:
                msg = "TIMEQUERY"
                try:
                    self.clientSock.sendto(msg.encode('ascii'), connectionTuple)
                except socket.error as msg:
                    print("Error: ", msg.strerror)
                    exit(-1)
            elif int(currentTime - startTime) % 10 == 0:
                msg = "DATEQUERY"
                try:
                    self.clientSock.sendto(msg.encode('ascii'), connectionTuple)
                except socket.error as msg:
                    print("Error: ", msg.strerror)
                    exit(-1)


class ServerThread(threading.Thread):
    def __init__(self):
        super(ServerThread, self).__init__(name="Server thread")

    def run(self):
        serverSocket = None
        try:
            serverSocket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
            serverSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
            serverSocket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
            serverSocket.bind(connectionTuple)
        except socket.error as msg:
            print("Error: ", msg.strerror)
            exit(-1)
        cnt = 0
        last = 0
        global count, peers, malformed
        while True:
            os.system("TERM=xterm clear")
            data, addr = serverSocket.recvfrom(1024)
            data = str(data.decode('ascii')).strip()
            ipPort = hash(addr)
            if ipPort not in peers:
                # safePrint("Port " + ipPort + " was added")
                # safePrint("Was received: " + data)
                peers.append(ipPort)
                count[ipPort] = 0
            if data == "TIMEQUERY":
                now = datetime.now().strftime("TIME %H:%M:%S\n")
                try:
                    serverSocket.sendto(now.encode('ascii'), addr)
                except socket.error as msg:
                    print("Error: ", msg.strerror)
                    exit(-1)
                cnt += 1
            elif data == "DATEQUERY":
                now = datetime.today().strftime("DATE %d:%m:%Y\n")
                try:
                    serverSocket.sendto(now.encode('ascii'), addr)
                except socket.error as msg:
                    print("Error: ", msg.strerror)
                    exit(-1)
                cnt += 1
            else:
                malformed.append([ipPort, data])
            toErase = []
            if last != cnt:
                for ip in count.keys():
                    if ip != hash(addr):
                        # safePrint(ip + ' ---> ' + hash(addr))
                        count[ip] -= -1
                        if count[ip] == 3:
                            print(count)
                            safePrint("The peer " + ip + " did not receive anything for 3 broadcasts. "
                                                                 "Removing...")
                            msg = "Go close yourself\n"
                            try:
                                serverSocket.sendto(msg.encode('ascii'), unhash(ip))
                            except socket.error as msg:
                                print("Error: ", msg.strerror)
                                exit(-1)
                            peers.remove(ip)
                            toErase.append(ip)
                    else:
                        count[ip] = 0
                for i in toErase:
                    del count[i]
                table = texttable.Texttable()
                table.add_row(["IP", "Time", "Date"])
                for p in peers:
                    table.add_row([p, datetime.now().strftime("TIME %H:%M:%S"), datetime.today().strftime("DATE %d:%m:%Y")])
                safePrint(table.draw())
                last = cnt
                tableMalformed = texttable.Texttable()
                tableMalformed.add_row(["IP", "Message"])
                for m in malformed:
                    tableMalformed.add_row(m)
                safePrint(tableMalformed.draw())
                time.sleep(1.5)


if __name__ == '__main__':
    lock = threading.Lock()
    safePrint("Starting application")
    client1 = ClientThread(1)
    client2 = ClientThread(2)
    # client3 = ClientThread(3)
    server = ServerThread()
    safePrint("Starting server")
    server.start()
    safePrint("Starting client 1")
    client1.start()
    time.sleep(1)
    safePrint("Starting client 2")
    client2.start()
    # time.sleep(5)
    # safePrint("Starting client 3")
    # client3.start()
    ths = []
    ths.append(client1)
    ths.append(client2)
    # ths.append(client3)
    for t in ths:
        t.join()
    server.join()