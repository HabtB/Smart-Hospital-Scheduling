import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/MockAuthContext'; 
import { PrivateRoute } from './components/PrivateRoute';
import Layout from './components/Layout';
import RoleBasedLogin from './components/RoleBasedLogin';
import PasswordChange from './components/PasswordChange';
import DashboardWithMockData from './components/DashboardWithMockData';
import StaffManagement from './pages/StaffManagement';
import { ShiftScheduling } from './components/ShiftScheduling';
import { RequestsManagement } from './components/RequestsManagement';
import { ENV_CONFIG } from './config/env';

// Placeholder components for routes not yet implemented
const Reports: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
    <div className="bg-white rounded-xl shadow-lg p-6">
      <p className="text-gray-600">Reports dashboard coming soon...</p>
    </div>
  </div>
);

const Notifications: React.FC = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h1>
    <div className="bg-white rounded-xl shadow-lg p-6">
      <p className="text-gray-600">Notification center coming soon...</p>
    </div>
  </div>
);

// Component that handles password change flow
const AppContent: React.FC = () => {
  const { currentUser, mustChangePassword } = useAuth();

  // If user is logged in but must change password, show password change form
  if (currentUser && mustChangePassword) {
    return (
      <PasswordChange 
        onPasswordChanged={() => window.location.reload()} 
      />
    );
  }

  // Normal app routing
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<RoleBasedLogin />} />
        
        {/* Private Routes */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              {ENV_CONFIG.USE_MOCK_DATA ? <DashboardWithMockData /> : <DashboardWithMockData />}
            </Layout>
          </PrivateRoute>
        } />
            
        
        <Route path="/staff" element={
          <PrivateRoute>
            <Layout>
              <StaffManagement />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/schedule" element={
          <PrivateRoute>
            <Layout>
              <ShiftScheduling />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/requests" element={
          <PrivateRoute>
            <Layout>
              <RequestsManagement />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/reports" element={
          <PrivateRoute>
            <Layout>
              <Reports />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/notifications" element={
          <PrivateRoute>
            <Layout>
              <Notifications />
            </Layout>
          </PrivateRoute>
        } />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;