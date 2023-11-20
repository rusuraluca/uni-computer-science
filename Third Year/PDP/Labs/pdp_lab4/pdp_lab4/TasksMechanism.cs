using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace pdp_lab4
{
    public static class TasksMechanism
    {
        public static async Task Main()
        {
            var entry = await Dns.GetHostEntryAsync(State.Host);
            var socket = new Socket(SocketType.Stream, ProtocolType.Tcp);
            var endpoint = new IPEndPoint(entry.AddressList[0], State.Port);

            var connectTask = ConnectAsync(socket, endpoint);
            await connectTask;

            var sendTask = SendAsync(socket, $"GET /documente-utile/ HTTP/1.1\r\nHost: {State.Host}\r\n\r\n");
            await sendTask;

            var receiveTask = ReceiveAsync(socket);
            await receiveTask;

            socket.Close();
        }

        private static Task ConnectAsync(Socket socket, EndPoint endpoint)
        {
            var tcs = new TaskCompletionSource<bool>();
            socket.BeginConnect(endpoint, ar =>
            {
                try
                {
                    socket.EndConnect(ar);
                    tcs.SetResult(true);
                }
                catch (Exception ex)
                {
                    tcs.SetException(ex);
                }
            }, null);
            return tcs.Task;
        }

        private static Task SendAsync(Socket socket, string requestText)
        {
            var tcs = new TaskCompletionSource<bool>();
            var requestBytes = Encoding.UTF8.GetBytes(requestText);
            socket.BeginSend(requestBytes, 0, requestBytes.Length, SocketFlags.None, ar =>
            {
                try
                {
                    socket.EndSend(ar);
                    tcs.SetResult(true);
                }
                catch (Exception ex)
                {
                    tcs.SetException(ex);
                }
            }, null);
            return tcs.Task;
        }

        private static Task ReceiveAsync(Socket socket)
        {
            var tcs = new TaskCompletionSource<bool>();
            var state = new State(socket);
            Receive(socket, state, tcs);
            return tcs.Task;
        }

        private static void Receive(Socket socket, State state, TaskCompletionSource<bool> tcs)
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
                        Receive(socket, state, tcs);
                    }
                    else
                    {
                        Console.WriteLine(state.Content.ToString());
                        tcs.SetResult(true);
                    }
                }
                catch (Exception ex)
                {
                    tcs.SetException(ex);
                }
            }, null);
        }

        public sealed class State 
        {
            public const string Host = "www.cnatdcu.ro";
            public const int Port = 80;
            public const int BufferLength = 1024;
            public readonly byte[] Buffer = new byte[BufferLength];
            public readonly ManualResetEvent ConnectDone = new ManualResetEvent(false);
            public StringBuilder Content = new StringBuilder();
            public readonly ManualResetEvent ReceiveDone = new ManualResetEvent(false);
            public readonly ManualResetEvent SendDone = new ManualResetEvent(false);
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