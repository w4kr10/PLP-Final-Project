import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import { Button } from '../ui/button';
import { Bell, MessageSquare, LogOut, User, Home, Activity, ShoppingCart, Users, Heart } from 'lucide-react';
import Notifications from '../notifications/Notifications';
import { useState } from 'react';

export default function Layout() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'mother':
        return [
          { icon: Home, label: 'Dashboard', path: '/dashboard' },
          { icon: Activity, label: 'Health', path: '/health' },
          { icon: ShoppingCart, label: 'Grocery', path: '/grocery-shop' },
          { icon: MessageSquare, label: 'Chat', path: '/chat' },
        ];
      case 'medical':
        return [
          { icon: Home, label: 'Dashboard', path: '/medical' },
          { icon: Users, label: 'Patients', path: '/medical/patients' },
          { icon: Activity, label: 'Appointments', path: '/medical/appointments' },
          { icon: MessageSquare, label: 'Chat', path: '/chat' },
        ];
      case 'grocery':
        return [
          { icon: Home, label: 'Dashboard', path: '/grocery' },
          { icon: ShoppingCart, label: 'Inventory', path: '/grocery/inventory' },
          { icon: Activity, label: 'Orders', path: '/grocery/orders' },
        ];
      case 'admin':
        return [
          { icon: Home, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'Users', path: '/admin/users' },
          { icon: Activity, label: 'Analytics', path: '/admin/analytics' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">MCaid</h1>
              </div>
              <span className="ml-4 px-3 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {user?.role}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 relative transition"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>

              {/* Logout */}
              <Button onClick={handleLogout} variant="ghost" size="sm" className="text-primary-600 hover:text-gray-900 hover:bg-cyan-500">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Notifications Panel */}
      {showNotifications && (
        <Notifications onClose={() => setShowNotifications(false)} />
      )}

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
