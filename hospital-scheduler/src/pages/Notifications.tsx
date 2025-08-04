import React, { useState } from 'react';
import { useAuth } from '../context/MockAuthContext';
import { 
  FaBell, 
  FaEnvelope, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaCheckCircle,
  FaTrash,
  FaEye,

  FaSearch
} from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  category: 'shift' | 'request' | 'system' | 'announcement';
}

const Notifications: React.FC = () => {
  const { } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | 'shift' | 'request' | 'system'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notifications - in a real app, this would come from your backend
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'urgent',
      title: 'Emergency Shift Coverage Needed',
      message: 'ICU night shift on Dec 15th needs immediate coverage. Please respond ASAP.',
      timestamp: new Date('2024-12-15T10:30:00'),
      isRead: false,
      category: 'shift'
    },
    {
      id: '2',
      type: 'success',
      title: 'Shift Request Approved',
      message: 'Your time-off request for Dec 20-22 has been approved by your supervisor.',
      timestamp: new Date('2024-12-14T14:15:00'),
      isRead: false,
      category: 'request'
    },
    {
      id: '3',
      type: 'info',
      title: 'Schedule Update',
      message: 'December schedule has been updated. Please review your assigned shifts.',
      timestamp: new Date('2024-12-14T09:00:00'),
      isRead: true,
      category: 'shift'
    },
    {
      id: '4',
      type: 'warning',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Dec 16th from 2-4 AM. System will be unavailable.',
      timestamp: new Date('2024-12-13T16:45:00'),
      isRead: true,
      category: 'system'
    },
    {
      id: '5',
      type: 'info',
      title: 'New Team Member',
      message: 'Welcome Dr. Sarah Johnson to the Cardiology department!',
      timestamp: new Date('2024-12-12T11:20:00'),
      isRead: true,
      category: 'announcement'
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'info':
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'success':
        return 'border-l-green-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread' && notif.isRead) return false;
    if (filter !== 'all' && filter !== 'unread' && notif.category !== filter) return false;
    if (searchTerm && !notif.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !notif.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <FaBell className="mr-3" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-blue-100">Stay updated with important announcements and alerts</p>
          </div>
          <FaEnvelope className="text-5xl text-blue-200" />
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('shift')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'shift' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shifts
            </button>
            <button
              onClick={() => setFilter('request')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'request' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setFilter('system')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'system' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              System
            </button>
          </div>
          
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FaBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications." 
                : "No notifications match your current filters."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl shadow-lg border-l-4 ${getBorderColor(notification.type)} ${
                !notification.isRead ? 'ring-2 ring-blue-100' : ''
              } transition-all duration-200 hover:shadow-xl`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 pt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-lg font-semibold ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                          {notification.timestamp.toLocaleDateString()} {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className={`mt-2 ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.category === 'shift' ? 'bg-blue-100 text-blue-800' :
                          notification.category === 'request' ? 'bg-green-100 text-green-800' :
                          notification.category === 'system' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.category}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.type === 'urgent' ? 'bg-red-100 text-red-800' :
                          notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          notification.type === 'success' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Mark as read"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete notification"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="space-x-3">
              <button
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark All as Read
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
