using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace pdp_lab4
{
    public static class AsyncAwaitMechanism
    {
        public static async Task Main3()
        {
            var entry = await Dns.GetHostEntryAsync(State.Host);
            var socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            var endpoint = new IPEndPoint(entry.AddressList[0], State.Port);

            await socket.ConnectAsync(endpoint);

            var requestText = $"GET /documente-utile/ HTTP/1.1\r\nHost: {State.Host}\r\n\r\n";
            var requestBytes = Encoding.UTF8.GetBytes(requestText);
            await socket.SendAsync(new ArraySegment<byte>(requestBytes), SocketFlags.None);

            var response = await ReceiveAllAsync(socket);
            Console.WriteLine(response);

            socket.Close();
        }
        private static async Task<string> ReceiveAllAsync(Socket socket)
        {
            var buffer = new byte[State.BufferLength];
            var response = new StringBuilder();
            while (true)
            {
                var bytesReceived = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), SocketFlags.None);
                if (bytesReceived == 0)
                    break;

                var responseText = Encoding.UTF8.GetString(buffer, 0, bytesReceived);
                response.Append(responseText);
            }
            return response.ToString();
        }

        public sealed class State 
        {
            public const string Host = "www.cnatdcu.ro";
            public const int Port = 80;
            public const int BufferLength = 1024;
        }
    }
}