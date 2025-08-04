import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/MockAuthContext';
import { 
  FaClipboardList, 
  FaUserClock, 
  FaHandshake, 
  FaCalendarAlt,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
  FaFilter,
  FaSearch,
  FaExclamationCircle,
  FaInfoCircle,
  FaChartBar,
  FaUserMd,
  FaUserNurse,
  FaStethoscope,
  FaEye,
  FaHistory,
  FaPlus,
  FaSpinner,
  FaFileAlt
} from 'react-icons/fa';

interface Request {
  id: string;
  staffName: string;
  staffRole: 'doctor' | 'nurse' | 'admin';
  type: 'swap' | 'cover' | 'time_off';
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  requestedDate: string;
  createdAt: string;
  urgency: 'low' | 'medium' | 'high';
  department: string;
}

const RequestsManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  const [requests] = useState<Request[]>([
    {
      id: '1',
      staffName: 'Dr. Sarah Smith',
      staffRole: 'doctor',
      type: 'swap',
      status: 'pending',
      reason: 'Family emergency - need to attend urgent family matter',
      requestedDate: '2024-01-15',
      createdAt: '2024-01-10',
      urgency: 'high',
      department: 'Emergency'
    },
    {
      id: '2',
      staffName: 'Nurse Emily Johnson',
      staffRole: 'nurse',
      type: 'time_off',
      status: 'approved',
      reason: 'Pre-planned vacation to visit family',
      requestedDate: '2024-01-20',
      createdAt: '2024-01-08',
      urgency: 'low',
      department: 'ICU'
    },
    {
      id: '3',
      staffName: 'Dr. Michael Wilson',
      staffRole: 'doctor',
      type: 'cover',
      status: 'pending',
      reason: 'Medical appointment - annual physical exam',
      requestedDate: '2024-01-18',
      createdAt: '2024-01-12',
      urgency: 'medium',
      department: 'Surgery'
    },
    {
      id: '4',
      staffName: 'Nurse Lisa Brown',
      staffRole: 'nurse',
      type: 'swap',
      status: 'rejected',
      reason: 'Personal appointment conflict',
      requestedDate: '2024-01-22',
      createdAt: '2024-01-14',
      urgency: 'low',
      department: 'Pediatrics'
    },
    {
      id: '5',
      staffName: 'Dr. James Davis',
      staffRole: 'doctor',
      type: 'time_off',
      status: 'pending',
      reason: 'Conference attendance - Medical Innovation Summit',
      requestedDate: '2024-01-25',
      createdAt: '2024-01-16',
      urgency: 'medium',
      department: 'Cardiology'
    }
  ]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = searchTerm === '' || 
        request.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || request.type === filterType;
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const matchesUrgency = filterUrgency === 'all' || request.urgency === filterUrgency;
      
      return matchesSearch && matchesType && matchesStatus && matchesUrgency;
    });
  }, [requests, searchTerm, filterType, filterStatus, filterUrgency]);

  const handleApprove = async (requestId: string) => {
    setProcessing(requestId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Approving request:', requestId);
    setProcessing(null);
    // TODO: Implement actual approval logic
  };

  const handleReject = async (requestId: string) => {
    setProcessing(requestId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Rejecting request:', requestId);
    setProcessing(null);
    // TODO: Implement actual rejection logic
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'swap': return <FaHandshake className="text-blue-600" />;
      case 'cover': return <FaUserClock className="text-green-600" />;
      case 'time_off': return <FaCalendarAlt className="text-purple-600" />;
      default: return <FaClipboardList className="text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cover': return 'bg-green-100 text-green-800 border-green-200';
      case 'time_off': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <FaUserMd className="text-blue-600" />;
      case 'nurse': return <FaUserNurse className="text-green-600" />;
      default: return <FaStethoscope className="text-gray-600" />;
    }
  };

  const getStatsCards = () => {
    const pending = requests.filter(r => r.status === 'pending');
    const approved = requests.filter(r => r.status === 'approved');
    const urgent = requests.filter(r => r.urgency === 'high' && r.status === 'pending');
    
    return [
      {
        title: "Pending Requests",
        value: pending.length,
        subtitle: "Awaiting review",
        icon: FaHourglassHalf,
        color: 'from-yellow-500 to-orange-500'
      },
      {
        title: "Approved Today",
        value: approved.length,
        subtitle: "Processed requests",
        icon: FaCheck,
        color: 'from-green-500 to-emerald-500'
      },
      {
        title: "Urgent Requests",
        value: urgent.length,
        subtitle: "Need immediate attention",
        icon: FaExclamationCircle,
        color: 'from-red-500 to-pink-500'
      },
      {
        title: "Total Requests",
        value: requests.length,
        subtitle: "All time",
        icon: FaClipboardList,
        color: 'from-blue-500 to-indigo-500'
      }
    ];
  };

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const processedRequests = filteredRequests.filter(r => r.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaClipboardList className="mr-3 text-blue-600" />
            Requests Management
          </h1>
          <p className="text-gray-600 mt-1">Review and manage staff requests for time off, shift swaps, and coverage</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg transform hover:scale-105">
            <FaPlus className="mr-2" />
            Create Request
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStatsCards().map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${card.color} rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-200 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                  <p className="text-white/70 text-xs mt-1">{card.subtitle}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3">
                  <Icon className="text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="swap">Shift Swap</option>
              <option value="cover">Coverage</option>
              <option value="time_off">Time Off</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Urgency</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaFilter className="mr-2" />
            {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FaHourglassHalf className="mr-3 text-yellow-600" />
              Pending Requests ({pendingRequests.length})
            </h2>
            <span className="text-sm text-gray-600">Requires your attention</span>
          </div>
        </div>
        
        {pendingRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {pendingRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        {getRoleIcon(request.staffRole)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.staffName}</h3>
                        <p className="text-sm text-gray-600">{request.department} Department</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(request.type)}`}>
                        {getTypeIcon(request.type)}
                        <span className="ml-1 capitalize">{request.type.replace('_', ' ')}</span>
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency === 'high' && <FaExclamationCircle className="mr-1" />}
                        {request.urgency.toUpperCase()} PRIORITY
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 font-medium mb-2">Request Details:</p>
                      <p className="text-gray-700">{request.reason}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        <span>Requested Date: {new Date(request.requestedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <FaHistory className="mr-2 text-gray-500" />
                        <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-3 ml-6">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex items-center px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </button>
                    
                    {userProfile?.role === 'admin' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processing === request.id}
                          className="flex items-center px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {processing === request.id ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaCheck className="mr-2" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={processing === request.id}
                          className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {processing === request.id ? (
                            <FaSpinner className="animate-spin mr-2" />
                          ) : (
                            <FaTimes className="mr-2" />
                          )}
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FaClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
            <p className="text-gray-500">All requests have been processed or no new requests submitted.</p>
          </div>
        )}
      </div>

      {/* Processed Requests */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <FaHistory className="mr-3 text-gray-600" />
            Recent Processed Requests ({processedRequests.length})
          </h2>
        </div>
        
        {processedRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-3">
                          {getRoleIcon(request.staffRole)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.staffName}</div>
                          <div className="text-sm text-gray-500">{request.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(request.type)}`}>
                        {getTypeIcon(request.type)}
                        <span className="ml-1 capitalize">{request.type.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="text-sm text-gray-900 truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.requestedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(request.status)}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900 flex items-center"
                      >
                        <FaEye className="mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No processed requests</h3>
            <p className="text-gray-500">Processed requests will appear here once reviewed.</p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaInfoCircle className="mr-3 text-blue-600" />
                Request Details
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-3">
                      {getRoleIcon(selectedRequest.staffRole)}
                    </div>
                    <div>
                      <div className="font-medium">{selectedRequest.staffName}</div>
                      <div className="text-sm text-gray-500">{selectedRequest.staffRole}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <p className="text-gray-900">{selectedRequest.department}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getTypeColor(selectedRequest.type)}`}>
                    {getTypeIcon(selectedRequest.type)}
                    <span className="ml-1 capitalize">{selectedRequest.type.replace('_', ' ')}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getUrgencyColor(selectedRequest.urgency)}`}>
                    {selectedRequest.urgency === 'high' && <FaExclamationCircle className="mr-1" />}
                    {selectedRequest.urgency.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800">{selectedRequest.reason}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested Date</label>
                  <p className="text-gray-900">{new Date(selectedRequest.requestedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submitted</label>
                  <p className="text-gray-900">{new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedRequest.status === 'pending' && userProfile?.role === 'admin' && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <FaTimes className="mr-2" />
                    Reject Request
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <FaCheck className="mr-2" />
                    Approve Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsManagement;
