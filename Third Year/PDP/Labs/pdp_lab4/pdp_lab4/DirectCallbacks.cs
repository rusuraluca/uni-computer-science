using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;

namespace pdp_lab4
{
    public static class DirectCallbacks
    {
        public static void Main1()
        {
            // DNS resolution
            var entry = Dns.GetHostEntry(State.Host);
            // TCP socket 
            var socket = new Socket(SocketType.Stream, ProtocolType.Tcp);
            // Endpoint with the obtained IP address and a specified port (port 80 for HTTP)
            var endpoint = new IPEndPoint(entry.AddressList[0], State.Port);
            var state = new State(socket);
            // Initiate an asynchronous connection attempt to the specified endpoint using BeginConnect
            state.Socket.BeginConnect(endpoint, ConnectCallback, state);
            state.ReceiveDone.WaitOne();
            state.Socket.Close();
        }
        
        private static void ConnectCallback(IAsyncResult ar)
        {
            // Callback function when the connection attempt completes
            var state = (State)ar.AsyncState;
            // If the connection succeeds (EndConnect),
            // it signals that the connection is done (ConnectDone event)
            // and sends an HTTP GET request to the server
            state.Socket.EndConnect(ar);
            state.ConnectDone.Set();
            var requestText = $"GET /documente-utile/ HTTP/1.1\r\nHost: {State.Host}\r\n\r\n";
            var requestBytes = Encoding.UTF8.GetBytes(requestText);
            // Upon sending the HTTP request asynchronously (BeginSend),
            // the SendCallback is triggered
            state.Socket.BeginSend(
                requestBytes, 
                0, 
                requestBytes.Length, 
                SocketFlags.None, 
                SendCallback, 
                state);
        }

        private static void SendCallback(IAsyncResult ar)
        {
            // When the data is sent (EndSend)
            // it signals that the sending is done (SendDone event)
            // and initiates receiving the response from the server
            var state = (State)ar.AsyncState;
            var bytesSent = state.Socket.EndSend(ar);
            state.SendDone.Set();
            // When data is received asynchronously (BeginReceive),
            // the ReceiveCallback is invoked
            state.Socket.BeginReceive(
                state.Buffer, 
                0, 
                State.BufferLength, 
                SocketFlags.None, 
                ReceiveCallback, 
                state);
        }

        private static void ReceiveCallback(IAsyncResult ar)
        {
            // Processes the received data, appending it to a StringBuilder
            var state = (State)ar.AsyncState;
            var bytesReceived = state.Socket.EndReceive(ar);
            // If the response indicates the end of transmission (0 bytes received),
            // it prints the accumulated response content to the console
            // and signals that receiving is done (ReceiveDone event)
            if (bytesReceived == 0) 
            {
                Console.WriteLine(state.Content.ToString());
                state.ReceiveDone.Set();
            }
            else 
            {
                var responseText = Encoding.UTF8.GetString(state.Buffer, 0, bytesReceived);
                state.Content.Append(responseText);
                state.Socket.BeginReceive(
                    state.Buffer, 
                    0, 
                    State.BufferLength, 
                    SocketFlags.None, 
                    ReceiveCallback,
                    state);
            }
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