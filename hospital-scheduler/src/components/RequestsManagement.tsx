import React, { useState } from 'react';
import { 
  FaClipboardList, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaCalendarTimes,
  FaExchangeAlt,
  FaClock,
  FaUserShield
} from 'react-icons/fa';
import { useAuth } from '../context/MockAuthContext';
import { hasPermission } from '../types/auth';
import { useMockRequests } from '../hooks/useMockData';
import type { Request } from '../types';

export const RequestsManagement: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { userProfile } = useAuth();
  const { requests, loading, approveRequest, rejectRequest } = useMockRequests();

  // Check if user can approve/reject requests
  const canManageRequests = userProfile ? hasPermission(userProfile.role, 'canApproveRequests') : false;
  const canViewAllRequests = userProfile ? hasPermission(userProfile.role, 'canViewStaff') : false;

  // Filter requests based on user role
  const getFilteredRequests = () => {
    let filteredRequests = requests;

    // Non-admin users only see their own requests plus any pending requests they can approve
    if (!canViewAllRequests && userProfile) {
      filteredRequests = requests.filter(request => 
        request.employeeId === userProfile.id || 
        (canManageRequests && request.status === 'pending')
      );
    }

    // Apply status filter
    if (filter !== 'all') {
      filteredRequests = filteredRequests.filter(request => request.status === filter);
    }

    return filteredRequests;
  };

  const handleApprove = async (request: Request) => {
    if (!canManageRequests) {
      alert('You do not have permission to approve requests.');
      return;
    }

    try {
      await approveRequest(request.id, userProfile?.id || '', 'Approved via dashboard');
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    }
  };

  const handleReject = async (request: Request, reason?: string) => {
    if (!canManageRequests) {
      alert('You do not have permission to reject requests.');
      return;
    }

    try {
      await rejectRequest(request.id, userProfile?.id || '', reason || 'Rejected via dashboard');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  const filteredRequests = getFilteredRequests();
  const pendingCount = filteredRequests.filter(r => r.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Management</h1>
            <p className="text-gray-600">
              {canManageRequests 
                ? 'Review and manage staff requests for time off and shift changes'
                : 'View your submitted requests and their status'
              }
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {pendingCount > 0 && canManageRequests && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium">
                {pendingCount} Pending Review{pendingCount !== 1 ? 's' : ''}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <FaUserShield className={`text-xl ${canManageRequests ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600">
                {canManageRequests ? 'Approval Rights' : 'View Only'}
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} 
              {status !== 'all' && ` (${filteredRequests.filter(r => r.status === status).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid gap-6">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <FaClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'There are no requests to display.' 
                : `No ${filter} requests found.`
              }
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      request.type === 'time_off' ? 'bg-blue-100' :
                      request.type === 'shift_swap' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {request.type === 'time_off' ? <FaCalendarTimes className="text-blue-600 text-xl" /> :
                       request.type === 'shift_swap' ? <FaExchangeAlt className="text-purple-600 text-xl" /> :
                       <FaClock className="text-green-600 text-xl" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {request.type.replace('_', ' ')} Request
                      </h3>
                      <p className="text-sm text-gray-600">
                        From: {request.employeeName} • {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    
                    {request.priority === 'high' && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 mb-2">{request.reason}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Start Date:</span>
                      <span className="ml-2 font-medium">{new Date(request.startDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">End Date:</span>
                      <span className="ml-2 font-medium">{new Date(request.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {request.reviewedBy && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Reviewed by:</strong> {request.reviewedBy} on {new Date(request.reviewedAt!).toLocaleDateString()}
                    </p>
                    {request.reviewNotes && (
                      <p className="text-sm text-gray-700 mt-1">
                        <strong>Notes:</strong> {request.reviewNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {request.status === 'pending' && canManageRequests && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(request)}
                      className="flex-1 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <FaCheck />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Please provide a reason for rejection:');
                        if (reason !== null) {
                          handleReject(request, reason);
                        }
                      }}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <FaTimes />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {request.status === 'pending' && !canManageRequests && (
                  <div className="text-center py-2">
                    <span className="text-sm text-gray-500">Waiting for approval from supervisor or admin</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {canViewAllRequests && (
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{filteredRequests.length}</div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredRequests.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {filteredRequests.filter(r => r.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">
                {filteredRequests.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
