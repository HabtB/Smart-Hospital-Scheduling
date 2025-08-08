import React from 'react';
import { useAuth } from '../context/MockAuthContext';
import DashboardWithMockData from './DashboardWithMockData';
import UserDashboard from '../pages/UserDashboard';
import { ENV_CONFIG } from '../config/env';

/**
 * RoleBasedDashboard Component
 * 
 * Renders different dashboard components based on user role:
 * - Doctors & Nurses: UserDashboard (personal view, no management features)
 * - Admins & Supervisors: DashboardWithMockData (management view)
 */
const RoleBasedDashboard: React.FC = () => {
  const { userProfile } = useAuth();

  // Debug logging to see what role is being detected
  console.log('🔍 RoleBasedDashboard - userProfile:', userProfile);
  console.log('🔍 RoleBasedDashboard - role:', userProfile?.role);

  // Render user-specific dashboard for doctors and nurses
  if (userProfile?.role === 'doctor' || userProfile?.role === 'nurse') {
    console.log('✅ Rendering UserDashboard for role:', userProfile.role);
    return <UserDashboard />;
  }

  // Render management dashboard for admins and supervisors
  console.log('✅ Rendering Management Dashboard for role:', userProfile?.role);
  return ENV_CONFIG.USE_MOCK_DATA ? <DashboardWithMockData /> : <DashboardWithMockData />;
};

export default RoleBasedDashboard;
