import React, { useState } from 'react';
import { useAuth } from '../context/MockAuthContext';
import { 
  FaCalendarAlt, 
  FaClipboardList, 
  FaBell, 
  FaClock,
  FaUserMd,
  FaUserNurse,
  FaStethoscope,
  FaPlus,
  FaExclamationCircle,
  FaCheckCircle,
  FaHourglassHalf
} from 'react-icons/fa';

interface UserShift {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  department: string;
  type: 'morning' | 'afternoon' | 'night';
  status: 'scheduled' | 'completed' | 'upcoming';
}

interface UserRequest {
  id: string;
  type: 'time-off' | 'shift-swap' | 'schedule-change';
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  urgency: 'low' | 'medium' | 'high';
}

interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
  isRead: boolean;
}

const UserDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'schedule' | 'requests' | 'notifications'>('schedule');
  const [showRequestForm, setShowRequestForm] = useState(false);

  // Mock data for user-specific content
  const [userShifts] = useState<UserShift[]>([
    {
      id: '1',
      date: '2024-12-16',
      startTime: '07:00',
      endTime: '15:00',
      department: 'Emergency',
      type: 'morning',
      status: 'upcoming'
    },
    {
      id: '2',
      date: '2024-12-17',
      startTime: '15:00',
      endTime: '23:00',
      department: 'Emergency',
      type: 'afternoon',
      status: 'scheduled'
    },
    {
      id: '3',
      date: '2024-12-15',
      startTime: '07:00',
      endTime: '15:00',
      department: 'Emergency',
      type: 'morning',
      status: 'completed'
    }
  ]);

  const [userRequests] = useState<UserRequest[]>([
    {
      id: '1',
      type: 'time-off',
      description: 'Family vacation - December 20-22',
      date: '2024-12-20',
      status: 'pending',
      urgency: 'medium'
    },
    {
      id: '2',
      type: 'shift-swap',
      description: 'Swap Dec 18 morning shift with evening',
      date: '2024-12-18',
      status: 'approved',
      urgency: 'low'
    }
  ]);

  const [userNotifications] = useState<UserNotification[]>([
    {
      id: '1',
      title: 'Shift Reminder',
      message: 'Your shift starts in 2 hours - Emergency Department',
      type: 'info',
      timestamp: '2024-12-16T05:00:00',
      isRead: false
    },
    {
      id: '2',
      title: 'Request Approved',
      message: 'Your shift swap request has been approved',
      type: 'success',
      timestamp: '2024-12-15T14:30:00',
      isRead: false
    }
  ]);

  const getRoleIcon = () => {
    switch (userProfile?.role) {
      case 'doctor':
        return <FaUserMd className="text-blue-600 text-2xl" />;
      case 'nurse':
        return <FaUserNurse className="text-green-600 text-2xl" />;
      default:
        return <FaStethoscope className="text-gray-600 text-2xl" />;
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'night': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingShifts = userShifts.filter(shift => shift.status === 'upcoming' || shift.status === 'scheduled');
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const unreadNotifications = userNotifications.filter(notif => !notif.isRead);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                {getRoleIcon()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {userProfile?.name}
                </h1>
                <p className="text-gray-600 capitalize">
                  {userProfile?.role} • {userProfile?.department}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Shifts</p>
              <p className="text-3xl font-bold text-blue-600">{upcomingShifts.length}</p>
            </div>
            <FaCalendarAlt className="text-blue-600 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <FaClipboardList className="text-yellow-600 text-2xl" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Notifications</p>
              <p className="text-3xl font-bold text-red-600">{unreadNotifications.length}</p>
            </div>
            <FaBell className="text-red-600 text-2xl" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'schedule', label: 'My Schedule', icon: FaCalendarAlt },
              { id: 'requests', label: 'My Requests', icon: FaClipboardList },
              { id: 'notifications', label: 'Notifications', icon: FaBell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'schedule' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Schedule</h2>
              </div>
              
              <div className="space-y-4">
                {userShifts.map((shift) => (
                  <div key={shift.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">
                            {new Date(shift.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(shift.date).getDate()}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{shift.department}</p>
                          <p className="text-sm text-gray-600">
                            {shift.startTime} - {shift.endTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getShiftTypeColor(shift.type)}`}>
                          {shift.type}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          shift.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          shift.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {shift.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Requests</h2>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <FaPlus className="text-sm" />
                  <span>New Request</span>
                </button>
              </div>

              <div className="space-y-4">
                {userRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {request.type.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Submitted: {new Date(request.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.status === 'pending' && (
                          <FaHourglassHalf className="text-yellow-600" />
                        )}
                        {request.status === 'approved' && (
                          <FaCheckCircle className="text-green-600" />
                        )}
                        {request.status === 'rejected' && (
                          <FaExclamationCircle className="text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Mark all as read
                </button>
              </div>

              <div className="space-y-4">
                {userNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
                      !notification.isRead ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-gray-900">{notification.title}</p>
                          {!notification.isRead && (
                            <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${
                        notification.type === 'success' ? 'bg-green-100' :
                        notification.type === 'warning' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        {notification.type === 'success' && <FaCheckCircle className="text-green-600" />}
                        {notification.type === 'warning' && <FaExclamationCircle className="text-yellow-600" />}
                        {notification.type === 'info' && <FaBell className="text-blue-600" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Simple Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit New Request</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Time Off</option>
                  <option>Shift Swap</option>
                  <option>Schedule Change</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                  placeholder="Please describe your request..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
