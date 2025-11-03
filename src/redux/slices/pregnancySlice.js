import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunks
export const getPregnancyRecord = createAsyncThunk(
  'pregnancy/getRecord',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/mother/pregnancy-record');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get pregnancy record');
    }
  }
);

export const updatePregnancyRecord = createAsyncThunk(
  'pregnancy/updateRecord',
  async (recordData, { rejectWithValue }) => {
    try {
      const response = await api.post('/mother/pregnancy-record', recordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update pregnancy record');
    }
  }
);

export const getAppointments = createAsyncThunk(
  'pregnancy/getAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/mother/appointments');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get appointments');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'pregnancy/bookAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/mother/appointments', appointmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to book appointment');
    }
  }
);

export const getMealPlan = createAsyncThunk(
  'pregnancy/getMealPlan',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/mother/meal-plan');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get meal plan');
    }
  }
);

const initialState = {
  pregnancyRecord: null,
  appointments: [],
  mealPlan: null,
  loading: false,
  error: null,
};

const pregnancySlice = createSlice({
  name: 'pregnancy',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addSymptom: (state, action) => {
      if (state.pregnancyRecord) {
        state.pregnancyRecord.symptoms.push(action.payload);
      }
    },
    updateHealthMetrics: (state, action) => {
      if (state.pregnancyRecord) {
        state.pregnancyRecord.healthMetrics = {
          ...state.pregnancyRecord.healthMetrics,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get pregnancy record
      .addCase(getPregnancyRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPregnancyRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.pregnancyRecord = action.payload.data || action.payload;
      })
      .addCase(getPregnancyRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update pregnancy record
      .addCase(updatePregnancyRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePregnancyRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.pregnancyRecord = action.payload.data || action.payload;
      })
      .addCase(updatePregnancyRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get appointments
      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data || action.payload;
      })
      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Book appointment
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const appointment = action.payload.data || action.payload;
        state.appointments.push(appointment);
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get meal plan
      .addCase(getMealPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.mealPlan = action.payload;
      })
      .addCase(getMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, addSymptom, updateHealthMetrics } = pregnancySlice.actions;
export default pregnancySlice.reducer;
