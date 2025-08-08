import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/MockAuthContext';
import NotificationPanel from './NotificationPanel';
import { 
  FaHome, 
  FaUsers, 
  FaCalendarAlt, 
  FaClipboardList, 
  FaChartBar, 
  FaBell, 
  FaCog, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaUserMd,
  FaUserNurse,
  FaShieldAlt,
  FaStethoscope,
  FaHospital
} from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
        return <FaStethoscope className="text-gray-600" />;
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800';
      case 'nurse':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: FaHome,
      description: 'Overview and key metrics',
      roles: ['admin', 'doctor', 'nurse', 'supervisor']
    },
    { 
      name: 'Staff Management', 
      href: '/staff', 
      icon: FaUsers,
      description: 'Manage team members',
      roles: ['admin', 'supervisor']
    },
    { 
      name: 'Shift Scheduling', 
      href: '/schedule', 
      icon: FaCalendarAlt,
      description: 'Schedule and assign shifts',
      roles: ['admin', 'supervisor', 'doctor']
    },
    { 
      name: 'Requests', 
      href: '/requests', 
      icon: FaClipboardList,
      description: 'Time off and shift swaps',
      roles: ['admin', 'supervisor', 'doctor', 'nurse']
    },
    { 
      name: 'Reports', 
      href: '/reports', 
      icon: FaChartBar,
      description: 'Analytics and insights',
      roles: ['admin', 'supervisor']
    },
    { 
      name: 'Notifications', 
      href: '/notifications', 
      icon: FaBell,
      description: 'Alerts and updates',
      roles: ['admin', 'supervisor', 'doctor', 'nurse']
    },
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => 
    !userProfile?.role || item.roles.includes(userProfile.role)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and header */}
          <div className="flex items-center justify-between h-20 px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <FaHospital className="text-blue-600 text-xl" />
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">Smart Hospital</h1>
                <p className="text-xs text-blue-100">Scheduler Pro</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <NotificationPanel />
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-white hover:text-blue-200 p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-2 overflow-y-auto">
            {/* Add role-specific section header */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {userProfile?.role === 'admin' || userProfile?.role === 'supervisor' 
                  ? 'Management' 
                  : 'Personal Dashboard'
                }
              </h3>
            </div>
            
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-5 py-4 text-sm font-medium rounded-2xl transition-all duration-200 group hover:scale-105 hover:shadow-md
                    ${active 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`mr-4 text-xl ${active ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'}`} />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className={`text-xs mt-1 ${active ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
                {getRoleIcon(userProfile?.role)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userProfile?.name || currentUser?.email}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(userProfile?.role)}`}>
                    {userProfile?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex-1 flex items-center justify-center px-4 py-3 text-sm text-gray-700 bg-white rounded-xl hover:bg-gray-100 transition-all hover:shadow-md border border-gray-200">
                <FaCog className="mr-2" />
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 flex items-center justify-center px-4 py-3 text-sm text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-all hover:shadow-md border border-red-200"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-6 bg-white shadow-sm border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-all"
          >
            <FaBars className="text-xl" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FaHospital className="text-white text-sm" />
            </div>
            <span className="font-bold text-gray-900">Smart Hospital</span>
          </div>
          <div className="w-12" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50">
          <div className="h-full p-6 lg:p-8">
            <div className="h-full w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
