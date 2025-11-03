import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunks for admin
export const getAdminDashboard = createAsyncThunk(
  'admin/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get dashboard data');
    }
  }
);

export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/users?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get users');
    }
  }
);

export const getPendingVerifications = createAsyncThunk(
  'admin/getPendingVerifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/verifications/pending');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get verifications');
    }
  }
);

export const verifyUser = createAsyncThunk(
  'admin/verifyUser',
  async ({ userId, status, feedback }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/verify/${userId}`, { status, feedback });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify user');
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'admin/updateUserStatus',
  async ({ userId, isVerified }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, { isVerified });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const getPlatformAnalytics = createAsyncThunk(
  'admin/getPlatformAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get analytics');
    }
  }
);

export const getAILogs = createAsyncThunk(
  'admin/getAILogs',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/ai-logs?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get AI logs');
    }
  }
);

// Get all stores with location and metrics
export const getStores = createAsyncThunk(
  'admin/getStores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/stores');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get stores');
    }
  }
);

// Get detailed store information
export const getStoreDetails = createAsyncThunk(
  'admin/getStoreDetails',
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/stores/${storeId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get store details');
    }
  }
);

const initialState = {
  dashboard: {
    totalUsers: 0,
    totalAppointments: 0,
    totalOrders: 0,
    growth: 0,
  },
  users: [],
  stores: [],
  selectedStore: null,
  pendingVerifications: [],
  analytics: null,
  aiLogs: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data || action.payload;
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get pending verifications
      .addCase(getPendingVerifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingVerifications.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingVerifications = action.payload.data || action.payload;
      })
      .addCase(getPendingVerifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify user
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.loading = false;
        const verifiedUser = action.payload.data || action.payload;
        state.pendingVerifications = state.pendingVerifications.filter(
          user => user._id !== verifiedUser._id
        );
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.data || action.payload;
        const index = state.users.findIndex(user => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload.userId);
      })
      // Get platform analytics
      .addCase(getPlatformAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlatformAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data || action.payload;
      })
      .addCase(getPlatformAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get AI logs
      .addCase(getAILogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAILogs.fulfilled, (state, action) => {
        state.loading = false;
        state.aiLogs = action.payload.data || action.payload;
      })
      .addCase(getAILogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get stores
      .addCase(getStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.data || action.payload;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get store details
      .addCase(getStoreDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStore = action.payload.data || action.payload;
      })
      .addCase(getStoreDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
