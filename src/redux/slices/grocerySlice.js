import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunks for mothers (shopping)
export const getGroceryItems = createAsyncThunk(
  'grocery/getItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/mother/grocery-items');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get grocery items');
    }
  }
);

export const createOrder = createAsyncThunk(
  'grocery/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/mother/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const getOrders = createAsyncThunk(
  'grocery/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/mother/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get orders');
    }
  }
);

// Async thunks for grocery store owners
export const getGroceryDashboard = createAsyncThunk(
  'grocery/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/grocery/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get dashboard data');
    }
  }
);

export const getInventory = createAsyncThunk(
  'grocery/getInventory',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters || {});
      const response = await api.get(`/grocery/inventory?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get inventory');
    }
  }
);

export const addInventoryItem = createAsyncThunk(
  'grocery/addInventoryItem',
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await api.post('/grocery/inventory', itemData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  }
);

export const updateInventoryItem = createAsyncThunk(
  'grocery/updateInventoryItem',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/grocery/inventory/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update item');
    }
  }
);

export const deleteInventoryItem = createAsyncThunk(
  'grocery/deleteInventoryItem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/grocery/inventory/${id}`);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete item');
    }
  }
);

export const getStoreOrders = createAsyncThunk(
  'grocery/getStoreOrders',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters || {});
      const response = await api.get(`/grocery/orders?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get store orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'grocery/updateOrderStatus',
  async ({ id, status, estimatedDeliveryTime }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/grocery/orders/${id}`, { status, estimatedDeliveryTime });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const getGroceryAnalytics = createAsyncThunk(
  'grocery/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/grocery/analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get analytics');
    }
  }
);

// Get nearby stores for mothers
export const getNearbyStores = createAsyncThunk(
  'grocery/getNearbyStores',
  async ({ lat, lng, radius = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/mother/stores/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get nearby stores');
    }
  }
);

const initialState = {
  items: [],
  orders: [],
  cart: [],
  nearbyStores: [],
  // Store owner specific state
  dashboard: {
    totalProducts: 0,
    availableProducts: 0,
    todayOrders: 0,
    pendingOrders: 0,
    recentOrders: [],
  },
  inventory: [],
  storeOrders: [],
  analytics: null,
  loading: false,
  error: null,
};

const grocerySlice = createSlice({
  name: 'grocery',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addToCart: (state, action) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get grocery items
      .addCase(getGroceryItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroceryItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
      })
      .addCase(getGroceryItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.cart = [];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get orders
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = Array.isArray(action.payload) ? action.payload : action.payload?.data || [];
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get grocery dashboard
      .addCase(getGroceryDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroceryDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data || action.payload;
      })
      .addCase(getGroceryDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get inventory
      .addCase(getInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload.data || action.payload;
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add inventory item
      .addCase(addInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory.push(action.payload.data || action.payload);
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update inventory item
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const updatedItem = action.payload.data || action.payload;
        const index = state.inventory.findIndex(item => item._id === updatedItem._id);
        if (index !== -1) {
          state.inventory[index] = updatedItem;
        }
      })
      // Delete inventory item
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.inventory = state.inventory.filter(item => item._id !== action.payload.id);
      })
      // Get store orders
      .addCase(getStoreOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStoreOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.storeOrders = action.payload.data || action.payload;
      })
      .addCase(getStoreOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.data || action.payload;
        const index = state.storeOrders.findIndex(order => order._id === updatedOrder._id);
        if (index !== -1) {
          state.storeOrders[index] = updatedOrder;
        }
      })
      // Get analytics
      .addCase(getGroceryAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGroceryAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data || action.payload;
      })
      .addCase(getGroceryAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get nearby stores
      .addCase(getNearbyStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNearbyStores.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyStores = action.payload.data || action.payload;
      })
      .addCase(getNearbyStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  clearCart 
} = grocerySlice.actions;
export default grocerySlice.reducer;
