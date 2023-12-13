using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace pdp_lab4
{
    public static class AsyncAwaitMechansism
    {
        public static async Task Main3()
        {
            var entry = await Dns.GetHostEntryAsync(State.Host);
            var socket = new Socket(SocketType.Stream, ProtocolType.Tcp);
            var endpoint = new IPEndPoint(entry.AddressList[0], State.Port);
            var state = new State(socket);

            await ConnectAsync(state.Socket, endpoint);
            await SendAsync(state.Socket, $"GET /documente-utile/ HTTP/1.1\r\nHost: {State.Host}\r\n\r\n");
            await ReceiveAsync(state.Socket);

            state.Socket.Close();
            socket.Close();
        }

        private static Task<Socket> ConnectAsync(Socket socket, EndPoint endpoint)
        {
            var promise = new TaskCompletionSource<Socket>();
            socket.BeginConnect(endpoint, ar =>
            {
                try
                {
                    socket.EndConnect(ar);
                    promise.SetResult(null);
                }
                catch (Exception ex)
                {
                    promise.SetException(ex);
                }
            }, null);
            return promise.Task;
        }
        
        private static Task<Socket> SendAsync(Socket socket, string requestText)
        {
            var promise = new TaskCompletionSource<Socket>();
            var requestBytes = Encoding.UTF8.GetBytes(requestText);
            socket.BeginSend(requestBytes, 0, requestBytes.Length, SocketFlags.None, ar =>
            {
                try
                {
                    socket.EndSend(ar);
                    promise.SetResult(socket);
                }
                catch (Exception ex)
                {
                    promise.SetException(ex);
                }
            }, null);
            return promise.Task;
        }

        private static Task<Socket> ReceiveAsync(Socket socket)
        {
            var promise = new TaskCompletionSource<Socket>();
            var state = new State(socket);
            Receive(socket, state, promise);
            return promise.Task;
        }

        private static void Receive(Socket socket, State state, TaskCompletionSource<Socket> promise)
        {
            socket.BeginReceive(state.Buffer, 0, State.BufferLength, SocketFlags.None, ar =>
            {
                try
                {
                    var bytesReceived = socket.EndReceive(ar);
                    if (bytesReceived > 0)
                    {
                        var responseText = Encoding.UTF8.GetString(state.Buffer, 0, bytesReceived);
                        state.Content.Append(responseText);
                        Receive(socket, state, promise);
                    }
                    else
                    {
                        Console.WriteLine(state.Content.ToString());
                        promise.SetResult(socket);
                    }
                }
                catch (Exception ex)
                {
                    promise.SetException(ex);
                }
            }, null);
        }

        public sealed class State
        {
            public const string Host = "www.cnatdcu.ro";
            public const int Port = 80;
            public const int BufferLength = 1024;
            public readonly byte[] Buffer = new byte[BufferLength];
            public StringBuilder Content = new StringBuilder();
            public readonly Socket Socket;

            public State(Socket socket)
            {
                // State class that holds
                // the socket,
                // various event flags for synchronization,
                // a buffer for data,
                // and the content received from the server
                Socket = socket;
            }
        }
    }
}