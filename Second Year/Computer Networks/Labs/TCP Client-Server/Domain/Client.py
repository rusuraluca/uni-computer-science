import socket
import struct

def main():
  server_socket = socket.socket(family=socket.AF_INET)
  server_socket.connect(("127.0.0.1",1234))
  domain = input("domain=")
  server_socket.send(struct.pack("!i", len(domain)))
  server_socket.send(domain.encode(encoding='ascii'))
  answer_length = struct.unpack('!i', server_socket.recv(4))[0]
  answer = server_socket.recv(answer_length)
  print(answer)
  server_socket.close()
  print(answer.decode('ascii'))

if __name__ == '__main__':
  main()