import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, markAllAsRead, removeNotification } from '../../redux/slices/notificationSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { X, Check, Bell } from 'lucide-react';

export default function Notifications({ onClose }) {
  const { notifications, unreadCount } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleRemove = (id) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="fixed top-16 right-4 w-96 max-h-[600px] overflow-hidden z-50 shadow-xl">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button onClick={handleMarkAllAsRead} variant="ghost" size="sm">
                  <Check className="h-4 w-4 mr-1 bg-violet-950" />
                  Mark all
                </Button>
              )}
              <button onClick={onClose} className="p-1 hover:bg-blue-950 rounded">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[500px] overflow-y-auto p-0">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-indigo-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold' : 'font-medium'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(notification.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Remove"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
