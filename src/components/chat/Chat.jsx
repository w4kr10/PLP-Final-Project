import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { getChatMessages, sendMessage, setConnectionStatus, addMessage, clearMessages } from '../../redux/slices/chatSlice';
import api from '../../api/axiosConfig';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Send, Bot, User as UserIcon } from 'lucide-react';

export default function Chat({ roomId, receiverId, receiverName, isAI = false }) {
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Load messages only if not AI chat (AI chat is real-time via Socket.IO only)
    if (roomId && !isAI) {
      console.log('Loading chat messages for room:', roomId);
      dispatch(getChatMessages(roomId)).catch(err => {
        console.warn('Could not load chat messages:', err);
        // Messages might not exist yet, which is fine
      });
    } else if (isAI) {
      console.log('AI chat room:', roomId);
      // For AI chat, clear current messages then load history via API
      dispatch(clearMessages());
      (async () => {
        try {
          const resp = await api.get('/ai/chat-history');
          if (resp?.data?.success && Array.isArray(resp.data.data)) {
            // populate messages
            resp.data.data.forEach((m) => dispatch(addMessage(m)));
            // scroll after messages loaded
            setTimeout(() => scrollToBottom(), 50);
          }
        } catch (err) {
          console.warn('Failed to load AI chat history:', err);
        }
      })();
    }

    // Setup Socket.IO connection
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverUrl = apiUrl.replace('/api', '');
    
    console.log('Connecting to Socket.IO at:', serverUrl);
    const newSocket = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token')
      }
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('\u2705 Socket connected:', newSocket.id);
      dispatch(setConnectionStatus(true));
      if (roomId) {
        newSocket.emit('join-room', roomId);
        console.log('Joined room:', roomId);
      }
    });

    newSocket.on('disconnect', (reason) => {
      console.log('\u274c Socket disconnected. Reason:', reason);
      dispatch(setConnectionStatus(false));
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      // Don't dispatch error to avoid breaking UI
    });

    newSocket.on('receive-message', (data) => {
      console.log('Received message:', data);
      dispatch(addMessage(data));
      scrollToBottom();
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return () => {
      console.log('Closing socket connection');
      newSocket.close();
    };
  }, [roomId, dispatch, isAI]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageData = {
      receiverId: receiverId || user.id,
      message: message.trim(),
      chatRoom: roomId,
      messageType: 'text'
    };

    try {
      if (isAI) {
        // For AI chat, use HTTP endpoint instead of relying on Socket.IO
        console.log('Sending AI message via HTTP:', messageData.message);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            message: messageData.message.trim(), 
            chatRoom: roomId 
          })
        }).then(res => res.json());

        console.log('AI response received:', response);
        
        if (response.success && response.data) {
          // Add user message
          dispatch(addMessage({
            senderId: user.id,
            message: messageData.message,
            chatRoom: roomId,
            isAI: false,
            createdAt: new Date().toISOString()
          }));
          
          // Add AI response
          if (response.data.aiMessage) {
            dispatch(addMessage({
              senderId: user.id,
              message: response.data.aiMessage.message || response.data.response,
              chatRoom: roomId,
              isAI: true,
              createdAt: new Date().toISOString()
            }));
          }
        }
      } else {
        // For regular chat, use Redux dispatch
        await dispatch(sendMessage(messageData)).unwrap();
        if (socket) {
          socket.emit('send-message', messageData);
        }
      }
      setMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Don't show error toast for AI, just log it
      if (!isAI) {
        alert('Failed to send message: ' + error.message);
      }
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-2">
          {isAI ? (
            <>
              <Bot className="h-5 w-5 text-indigo-600" />
              <span>AI Assistant</span>
            </>
          ) : (
            <>
              <UserIcon className="h-5 w-5 text-indigo-600" />
              <span>{receiverName}</span>
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.senderId === user.id || (isAI && !msg.isAI);
            return (
              <div
                key={index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isOwnMessage
                      ? 'bg-indigo-600 text-white'
                      : msg.isAI
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-indigo-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="border-t">
        <form onSubmit={handleSend} className="flex w-full space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim()}>
            <Send className="h-4 w-4 bg-sky-600 hover:bg-blue-600" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
