import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Async thunks for medical personnel
export const getMedicalDashboard = createAsyncThunk(
  'medical/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/medical/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get dashboard data');
    }
  }
);

export const getPatients = createAsyncThunk(
  'medical/getPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/medical/patients');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get patients');
    }
  }
);

export const getPatientDetails = createAsyncThunk(
  'medical/getPatientDetails',
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/medical/patients/${patientId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get patient details');
    }
  }
);

export const getMedicalAppointments = createAsyncThunk(
  'medical/getAppointments',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await api.get(`/medical/appointments?${params}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get appointments');
    }
  }
);

export const updateMedicalAppointment = createAsyncThunk(
  'medical/updateAppointment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/medical/appointments/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update appointment');
    }
  }
);

export const addPatientNotes = createAsyncThunk(
  'medical/addPatientNotes',
  async ({ patientId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/medical/patients/${patientId}/notes`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add notes');
    }
  }
);

export const prescribeMedication = createAsyncThunk(
  'medical/prescribeMedication',
  async ({ patientId, medicationData }, { rejectWithValue }) => {
    try {
      console.log('Prescribing medication:', { patientId, medicationData });
      const response = await api.post(`/medical/patients/${patientId}/medications`, medicationData);
      console.log('Medication response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Medication prescription error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to prescribe medication');
    }
  }
);

export const getMedicalAnalytics = createAsyncThunk(
  'medical/getAnalytics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/medical/analytics');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get analytics');
    }
  }
);

const initialState = {
  dashboard: {
    todayAppointments: [],
    upcomingAppointments: [],
    totalPatients: 0,
  },
  patients: [],
  selectedPatient: null,
  appointments: [],
  analytics: null,
  loading: false,
  error: null,
};

const medicalSlice = createSlice({
  name: 'medical',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard
      .addCase(getMedicalDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMedicalDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data || action.payload;
      })
      .addCase(getMedicalDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get patients
      .addCase(getPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload.data || action.payload;
      })
      .addCase(getPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get patient details
      .addCase(getPatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPatient = action.payload.data || action.payload;
      })
      .addCase(getPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get appointments
      .addCase(getMedicalAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMedicalAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.data || action.payload;
      })
      .addCase(getMedicalAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update appointment
      .addCase(updateMedicalAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMedicalAppointment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAppointment = action.payload.data || action.payload;
        const index = state.appointments.findIndex(apt => apt._id === updatedAppointment._id);
        if (index !== -1) {
          state.appointments[index] = updatedAppointment;
        }
      })
      .addCase(updateMedicalAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add patient notes
      .addCase(addPatientNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPatientNotes.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedPatient) {
          state.selectedPatient = action.payload.data || action.payload;
        }
      })
      .addCase(addPatientNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Prescribe medication
      .addCase(prescribeMedication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(prescribeMedication.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedPatient) {
          state.selectedPatient = action.payload.data || action.payload;
        }
      })
      .addCase(prescribeMedication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get analytics
      .addCase(getMedicalAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMedicalAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data || action.payload;
      })
      .addCase(getMedicalAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedPatient } = medicalSlice.actions;
export default medicalSlice.reducer;
