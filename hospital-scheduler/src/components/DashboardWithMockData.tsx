import React from 'react';
import { 
  useMockStaff, 
  useMockShifts, 
  useMockRequests, 
  useMockActivity, 
  useMockStats 
} from '../hooks/useMockData';
import { 
  UserGroupIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const DashboardWithMockData: React.FC = () => {
  const { staff, loading: staffLoading } = useMockStaff();
  const { shifts, loading: shiftsLoading } = useMockShifts();
  const { requests, loading: requestsLoading } = useMockRequests();
  const { activity, loading: activityLoading } = useMockActivity();
  const { stats, loading: statsLoading } = useMockStats();

  if (statsLoading || staffLoading || shiftsLoading || requestsLoading || activityLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mock data...</p>
        </div>
      </div>
    );
  }

  const understaffedShifts = shifts.filter(shift => shift.status === 'understaffed');
  const pendingRequests = requests.filter(request => request.status === 'pending');
  const todayShifts = shifts.filter(shift => {
    const today = new Date().toISOString().split('T')[0];
    return shift.startTime.split('T')[0] === today;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Hospital Scheduling Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to your hospital scheduling system. Here's today's overview with mock data.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalStaff || 0}</p>
              <p className="text-sm text-green-600">
                {stats?.activeStaff || 0} active
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shifts</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalShifts || 0}</p>
              <p className="text-sm text-orange-600">
                {stats?.understaffedShifts || 0} understaffed
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.pendingRequests || 0}</p>
              <p className="text-sm text-blue-600">
                {stats?.approvedRequests || 0} approved
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <DocumentTextIcon className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.departments || 0}</p>
              <p className="text-sm text-purple-600">
                {stats?.averageStaffPerDepartment || 0} avg staff/dept
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alerts */}
      {understaffedShifts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">
              Urgent: Understaffed Shifts
            </h3>
          </div>
          <div className="space-y-3">
            {understaffedShifts.slice(0, 3).map(shift => (
              <div key={shift.id} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{shift.title}</h4>
                    <p className="text-sm text-gray-600">{shift.department}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(shift.startTime).toLocaleString()} - {new Date(shift.endTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {shift.assignedStaff.length}/{shift.staffRequired} staff
                    </p>
                    <p className="text-xs text-gray-500">
                      Need {shift.staffRequired - shift.assignedStaff.length} more
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Staff by Department */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Staff by Department</h3>
          <div className="space-y-4">
            {Object.entries(
              staff.reduce((acc: any, member) => {
                acc[member.department] = (acc[member.department] || 0) + 1;
                return acc;
              }, {})
            ).map(([department, count]) => (
              <div key={department} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{department}</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {count as number} staff
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pending Requests</h3>
          <div className="space-y-4">
            {pendingRequests.slice(0, 5).map(request => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{request.staffName}</h4>
                    <p className="text-sm text-gray-600 capitalize">{request.type.replace('-', ' ')}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200">
                      Approve
                    </button>
                    <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200">
                      Reject
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{request.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Today's Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {todayShifts.map(shift => (
            <div key={shift.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-900">{shift.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  shift.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {shift.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{shift.department}</p>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(shift.startTime).toLocaleTimeString()} - {new Date(shift.endTime).toLocaleTimeString()}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Staff: {shift.assignedStaff.length}/{shift.staffRequired}
                </span>
                <div className="flex space-x-1">
                  {shift.assignedStaff.map(staffId => {
                    const staffMember = staff.find(s => s.id === staffId);
                    return (
                      <div key={staffId} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-blue-700">
                          {staffMember?.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {activity.slice(0, 8).map(item => (
            <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.message}</p>
                <p className="text-xs text-gray-500">{item.details}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardWithMockData;
