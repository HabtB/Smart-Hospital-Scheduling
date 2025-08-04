import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/MockAuthContext';
import { useStaff, useShifts, useActivityFeed } from '../hooks/useRealtimeData';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaChartBar, 
  FaUserMd,
  FaUserNurse,
  FaClock,
  FaExclamationTriangle,
  FaArrowUp,
  FaPlus,
  FaBell,
  FaEye,
  FaCalendarCheck,
  FaHeart,
  FaShieldAlt
} from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { staff, loading: staffLoading } = useStaff();
  const { shifts, loading: shiftsLoading } = useShifts();
  const { activities, loading: activitiesLoading } = useActivityFeed();

  // Calculate key metrics
  const activeStaff = staff.filter(s => s.isActive);
  const todayShifts = shifts.filter(shift => {
    const today = new Date();
    const shiftDate = shift.startTime?.toDate?.() || new Date(shift.startTime);
    return shiftDate.toDateString() === today.toDateString();
  });
  const unassignedShifts = shifts.filter(shift => !shift.assignedStaffId);
  const myShifts = shifts.filter(shift => shift.assignedStaffId === userProfile?.id);

  const quickActions = [
    {
      title: 'Schedule Shift',
      description: 'Create and assign new shifts',
      icon: FaCalendarAlt,
      href: '/shifts',
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Manage Staff',
      description: 'Add or update team members',
      icon: FaUsers,
      href: '/staff',
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-600'
    },
    {
      title: 'View Requests',
      description: 'Handle time-off and swaps',
      icon: FaClipboardList,
      href: '/requests',
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Generate Reports',
      description: 'Analytics and insights',
      icon: FaChartBar,
      href: '/reports',
      color: 'from-orange-500 to-red-500',
      iconColor: 'text-orange-600'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'doctor':
        return <FaUserMd className="text-blue-600" />;
      case 'nurse':
        return <FaUserNurse className="text-green-600" />;
      case 'admin':
        return <FaShieldAlt className="text-purple-600" />;
      default:
        return <FaHeart className="text-red-500" />;
    }
  };

  if (staffLoading || shiftsLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-10 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">
              {getGreeting()}, {userProfile?.name || 'User'}!
            </h1>
            <p className="text-blue-100 text-xl">
              Welcome back to your hospital management dashboard
            </p>
            <div className="mt-4 flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-medium">Today: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-medium">Role: {userProfile?.role || 'User'}</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-4">
            <div className="h-20 w-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              {getRoleIcon(userProfile?.role)}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Staff</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activeStaff.length}</p>
              <p className="text-sm text-green-600 mt-1 flex items-center">
                <FaArrowUp className="mr-1" />
                {staff.length} total
              </p>
            </div>
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Today's Shifts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{todayShifts.length}</p>
              <p className="text-sm text-blue-600 mt-1 flex items-center">
                <FaClock className="mr-1" />
                Scheduled
              </p>
            </div>
            <div className="h-16 w-16 bg-green-50 rounded-2xl flex items-center justify-center">
              <FaCalendarAlt className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Unassigned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{unassignedShifts.length}</p>
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <FaExclamationTriangle className="mr-1" />
                Need attention
              </p>
            </div>
            <div className="h-16 w-16 bg-red-50 rounded-2xl flex items-center justify-center">
              <FaClipboardList className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">My Shifts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{myShifts.length}</p>
              <p className="text-sm text-purple-600 mt-1 flex items-center">
                <FaCalendarCheck className="mr-1" />
                This month
              </p>
            </div>
            <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center">
              <FaUserMd className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          <span className="text-sm text-gray-500">Get started with common tasks</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.href}
                className="group bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`h-16 w-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}>
                    <Icon className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm font-medium group-hover:bg-blue-50 group-hover:text-blue-700 transition-all">
                      Get Started <FaPlus className="ml-2 text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaCalendarAlt className="mr-3 text-blue-600" />
              Today's Schedule
            </h2>
            <Link 
              to="/shifts" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-all"
            >
              View all <FaEye className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {todayShifts.length === 0 ? (
              <div className="text-center py-12">
                <FaCalendarAlt className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No shifts scheduled for today</p>
                <Link
                  to="/shifts"
                  className="inline-flex items-center mt-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
                >
                  <FaPlus className="mr-2" />
                  Schedule a shift
                </Link>
              </div>
            ) : (
              todayShifts.slice(0, 4).map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaClock className="text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{shift.title}</p>
                      <p className="text-sm text-gray-600">{shift.department}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {shift.startTime?.toDate?.()?.toLocaleTimeString() || 'TBD'}
                    </p>
                    <p className={`text-xs ${shift.assignedStaffId ? 'text-green-600' : 'text-red-600'}`}>
                      {shift.assignedStaffId ? '✓ Assigned' : '⚠ Unassigned'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaBell className="mr-3 text-purple-600" />
              Recent Activity
            </h2>
            <Link 
              to="/notifications" 
              className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center bg-purple-50 px-4 py-2 rounded-full hover:bg-purple-100 transition-all"
            >
              View all <FaEye className="ml-1" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {activities.length === 0 ? (
              <div className="text-center py-12">
                <FaBell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No recent activities</p>
                <p className="text-gray-400 text-sm mt-2">Activities will appear here as they happen</p>
              </div>
            ) : (
              activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-all">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                    <FaBell className="text-purple-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.timestamp?.toDate?.()?.toLocaleString() || 'Recently'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Urgent Alerts */}
      {unassignedShifts.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-red-100 rounded-2xl flex items-center justify-center mr-6">
                <FaExclamationTriangle className="text-red-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-900">Urgent: Unassigned Shifts</h3>
                <p className="text-red-700 mt-1">
                  {unassignedShifts.length} shift{unassignedShifts.length !== 1 ? 's' : ''} need immediate attention
                </p>
              </div>
            </div>
            <Link
              to="/shifts"
              className="bg-red-600 text-white px-8 py-4 rounded-xl hover:bg-red-700 transition-all flex items-center shadow-lg hover:shadow-xl font-semibold"
            >
              Assign Now <FaArrowUp className="ml-2" />
            </Link>
          </div>
        </div>
      )}

      {/* Tomorrow's Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center mr-6">
              <FaCalendarAlt className="text-blue-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Tomorrow's Schedule Preview</h3>
              <p className="text-blue-700">Plan ahead for smooth operations</p>
            </div>
          </div>
          <Link
            to="/shifts"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center shadow-lg hover:shadow-xl font-semibold"
          >
            Plan Tomorrow <FaCalendarAlt className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
