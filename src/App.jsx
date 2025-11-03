import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './redux/store';
import { Toaster } from './components/ui/toaster';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import MotherDashboard from './pages/MotherDashboard/MotherDashboard';
import MedicalDashboard from './pages/MedicalDashboard/MedicalDashboard';
import GroceryDashboard from './pages/GroceryDashboard/GroceryDashboard';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<MotherDashboard />} />
                <Route path="medical" element={<MedicalDashboard />} />
                <Route path="grocery" element={<GroceryDashboard />} />
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
