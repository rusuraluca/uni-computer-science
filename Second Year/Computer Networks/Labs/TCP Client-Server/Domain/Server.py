import socket
import threading
import struct

def processClient(client:socket.socket, addr:str):
  length = struct.unpack("!i", client.recv(4))[0]
  domain = client.recv(length).decode(encoding='ascii')
  requested_ip = socket.gethostbyname(domain)
  requested_socket = socket.socket(socket.AF_INET)
  requested_socket.connect((requested_ip, 80))
  requested_socket.send(b'GET / HTTP/1.0\n\n')
  ans = b''
  while True:
    answer = requested_socket.recv(1024)
    ans += answer
    if len(answer) < 1024:
      break
  client.send(struct.pack("!i", len(answer)))
  client.send(answer)
  client.close()

def main():
  server = socket.socket(socket.AF_INET)
  server.bind(("0.0.0.0", 1234))

  server.listen(2)

  try:
    while True:
      client, addr = server.accept()
      t = threading.Thread(target=processClient, daemon=True, args=(client, addr))
      t.start()
  except KeyboardInterrupt:
    server.close()

if __name__ == '__main__':
  main()