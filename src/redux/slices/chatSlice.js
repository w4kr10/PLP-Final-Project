import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunks
export const getChatMessages = createAsyncThunk(
  'chat/getMessages',
  async (roomId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/messages/${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/messages', messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const getChatRooms = createAsyncThunk(
  'chat/getRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/rooms');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get chat rooms');
    }
  }
);

export const createChatRoom = createAsyncThunk(
  'chat/createRoom',
  async (roomData, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/rooms', roomData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat room');
    }
  }
);

const initialState = {
  messages: [],
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get chat messages
      .addCase(getChatMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get chat rooms
      .addCase(getChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(getChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create chat room
      .addCase(createChatRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChatRoom.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(createChatRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  setCurrentRoom, 
  addMessage, 
  setConnectionStatus, 
  clearMessages 
} = chatSlice.actions;
export default chatSlice.reducer;
