import React, { useState, useMemo } from 'react';
import { useShifts, useStaff } from '../hooks/useRealtimeData';
import { shiftService } from '../services/firebaseService';
import { ShiftData } from '../types';
import { Timestamp } from 'firebase/firestore';
import { 
  FaCalendarPlus, 
  FaCalendarAlt, 
  FaUsers, 
  FaClock,
  FaFilter,
  FaSearch,
  FaPlus,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
  FaStethoscope,
  FaUserMd,
  FaUserNurse,
  FaEye,
  FaEdit,
  FaTrash,
  FaArrowRight
} from 'react-icons/fa';

const ShiftScheduling: React.FC = () => {
  const { shifts, loading: shiftsLoading } = useShifts();
  const { staff, loading: staffLoading } = useStaff();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [formData, setFormData] = useState({
    departmentId: '',
    startTime: '',
    endTime: '',
    requiredRole: '',
    requiredCertifications: [] as string[]
  });

  // Get unique departments from shifts and staff
  const departments = useMemo(() => {
    const depts = new Set<string>();
    shifts.forEach(shift => depts.add(shift.departmentId));
    staff.forEach(s => depts.add(s.departmentId));
    return Array.from(depts).sort();
  }, [shifts, staff]);

  // Filter shifts based on selected filters
  const filteredShifts = useMemo(() => {
    return shifts.filter(shift => {
      const matchesDepartment = filterDepartment === 'all' || shift.departmentId === filterDepartment;
      const matchesStatus = filterStatus === 'all' || shift.status === filterStatus;
      const matchesSearch = searchTerm === '' || 
        shift.departmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shift.requiredRole && shift.requiredRole.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDate = selectedDate === '' || 
        shift.startTime.toDate().toDateString() === new Date(selectedDate).toDateString();
      
      return matchesDepartment && matchesStatus && matchesSearch && matchesDate;
    });
  }, [shifts, filterDepartment, filterStatus, searchTerm, selectedDate]);

  const handleCreateShift = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const shiftData: ShiftData = {
        departmentId: formData.departmentId,
        startTime: Timestamp.fromDate(new Date(formData.startTime)),
        endTime: Timestamp.fromDate(new Date(formData.endTime)),
        requiredRole: formData.requiredRole || undefined,
        requiredCertifications: formData.requiredCertifications.length > 0 ? formData.requiredCertifications : undefined
      };

      await shiftService.createShift(shiftData);
      setShowCreateForm(false);
      setFormData({
        departmentId: '',
        startTime: '',
        endTime: '',
        requiredRole: '',
        requiredCertifications: []
      });
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

  const handleAssignShift = async (shiftId: string, staffId: string) => {
    try {
      await shiftService.assignShift(shiftId, staffId);
    } catch (error) {
      console.error('Error assigning shift:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filled':
        return <FaCheck className="text-green-600" />;
      case 'open':
        return <FaExclamationTriangle className="text-yellow-600" />;
      default:
        return <FaTimes className="text-red-600" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor':
        return <FaUserMd className="text-blue-600" />;
      case 'nurse':
        return <FaUserNurse className="text-green-600" />;
      default:
        return <FaStethoscope className="text-gray-600" />;
    }
  };

  const getStatsCards = () => {
    const today = new Date();
    const todayShifts = shifts.filter(s => 
      s.startTime.toDate().toDateString() === today.toDateString()
    );
    const openShifts = shifts.filter(s => s.status === 'open');
    const urgentShifts = shifts.filter(s => 
      s.status === 'open' && 
      new Date(s.startTime.toDate()).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000
    );

    return [
      {
        title: "Today's Shifts",
        value: todayShifts.length,
        subtitle: `${todayShifts.filter(s => s.status === 'filled').length} filled`,
        icon: FaCalendarAlt,
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: "Open Positions",
        value: openShifts.length,
        subtitle: "Need assignment",
        icon: FaUsers,
        color: 'from-yellow-500 to-orange-500'
      },
      {
        title: "Urgent Coverage",
        value: urgentShifts.length,
        subtitle: "Within 24 hours",
        icon: FaExclamationTriangle,
        color: 'from-red-500 to-red-600'
      },
      {
        title: "Total Shifts",
        value: shifts.length,
        subtitle: "This period",
        icon: FaClock,
        color: 'from-purple-500 to-purple-600'
      }
    ];
  };

  if (shiftsLoading || staffLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            Shift Scheduling
          </h1>
          <p className="text-gray-600 mt-1">Manage and assign hospital shifts efficiently</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg transform hover:scale-105"
          >
            <FaCalendarPlus className="mr-2" />
            Create Shift
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search shifts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="filled">Filled</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Create Shift Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaCalendarPlus className="mr-3 text-blue-600" />
                Create New Shift
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleCreateShift} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Role
                  </label>
                  <select
                    value={formData.requiredRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, requiredRole: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any Role</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Create Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shifts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Shifts ({filteredShifts.length})
          </h2>
        </div>
        
        {filteredShifts.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No shifts found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or create a new shift.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Shift
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredShifts.map((shift) => {
              const assignedStaff = staff.find(s => s.id === shift.assignedStaffId);
              const availableStaff = staff.filter(s => 
                s.departmentId === shift.departmentId && 
                s.isActive &&
                (!shift.requiredRole || s.role === shift.requiredRole)
              );
              
              return (
                <div key={shift.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(shift.status)}
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            shift.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                            shift.status === 'filled' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {shift.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {shift.departmentId}
                        </div>
                        {shift.requiredRole && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            {getRoleIcon(shift.requiredRole)}
                            <span className="capitalize">{shift.requiredRole}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-2 text-blue-500" />
                          <div>
                            <div className="font-medium">
                              {shift.startTime?.toDate?.()?.toLocaleDateString()}
                            </div>
                            <div className="text-xs">
                              {shift.startTime?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {shift.endTime?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaUsers className="mr-2 text-green-500" />
                          <div>
                            <div className="font-medium">
                              {assignedStaff ? assignedStaff.name : 'Unassigned'}
                            </div>
                            {assignedStaff && (
                              <div className="text-xs capitalize">{assignedStaff.role}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-end space-x-2">
                          {shift.status === 'open' && availableStaff.length > 0 && (
                            <select
                              onChange={(e) => e.target.value && handleAssignShift(shift.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
                              defaultValue=""
                            >
                              <option value="">Assign Staff</option>
                              {availableStaff.map(s => (
                                <option key={s.id} value={s.id}>
                                  {s.name} ({s.role})
                                </option>
                              ))}
                            </select>
                          )}
                          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                            <FaEye />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                            <FaEdit />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftScheduling;
