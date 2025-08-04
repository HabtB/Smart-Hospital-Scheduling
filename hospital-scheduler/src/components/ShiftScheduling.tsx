import React, { useState, useMemo } from 'react';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilter,
  FaClock,
  FaUsers,
  FaUserMd,
  FaUserNurse,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarWeek,
  FaExclamationTriangle,
  FaUserShield
} from 'react-icons/fa';
import { useAuth } from '../context/MockAuthContext';
import { hasPermission } from '../types/auth';
import { useMockShifts, useMockStaff } from '../hooks/useMockData';
import { Shift, Staff } from '../types';

type ViewType = 'week' | 'month';

export const ShiftScheduling: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('week');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { userProfile } = useAuth();
  const { shifts, loading: shiftsLoading, addShift, updateShift, deleteShift } = useMockShifts();
  const { staff, loading: staffLoading } = useMockStaff();

  // Check permissions
  const canCreateShifts = userProfile ? hasPermission(userProfile.role, 'canCreateShifts') : false;
  const canEditShifts = userProfile ? hasPermission(userProfile.role, 'canEditShifts') : false;
  const canViewSchedule = userProfile ? hasPermission(userProfile.role, 'canViewSchedule') : false;
  const canManageSchedule = canCreateShifts || canEditShifts;
  
  const [showMyShiftsOnly, setShowMyShiftsOnly] = useState(!canManageSchedule);

  // If user doesn't have permission, show access denied
  if (!canViewSchedule) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <FaUserShield className="text-6xl text-red-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to view the schedule.</p>
          <p className="text-sm text-gray-500">Contact your administrator for access to this feature.</p>
        </div>
      </div>
    );
  }

  // Get unique departments for filtering
  const departments = useMemo(() => {
    return [...new Set(staff.map(member => member.department))];
  }, [staff]);

  // Filter shifts based on department and user view
  const filteredShifts = useMemo(() => {
    let filtered = shifts;
    
    // Filter by user's own shifts if "My Shifts Only" is enabled
    if (showMyShiftsOnly && userProfile) {
      filtered = filtered.filter(shift => shift.staffId === userProfile.id);
    }
    
    // Filter by department
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(shift => 
        staff.find(member => member.id === shift.staffId)?.department === selectedDepartment
      );
    }
    
    return filtered;
  }, [shifts, staff, selectedDepartment, showMyShiftsOnly, userProfile]);

  // Get week or month view dates
  const getViewDates = () => {
    const dates = [];
    const start = new Date(currentDate);
    
    if (viewType === 'week') {
      start.setDate(start.getDate() - start.getDay()); // Start from Sunday
      for (let i = 0; i < 7; i++) {
        dates.push(new Date(start));
        start.setDate(start.getDate() + 1);
      }
    } else {
      start.setDate(1);
      start.setDate(start.getDate() - start.getDay()); // Start from Sunday before first day
      for (let i = 0; i < 42; i++) { // 6 weeks
        dates.push(new Date(start));
        start.setDate(start.getDate() + 1);
      }
    }
    
    return dates;
  };

  // Get shifts for a specific date
  const getShiftsForDate = (date: Date) => {
    return filteredShifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.toDateString() === date.toDateString();
    });
  };

  // Get staff member for a shift
  const getStaffMember = (staffId: string) => {
    return staff.find(member => member.id === staffId);
  };

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Handle form submission
  const handleSubmit = async (formData: Partial<Shift>) => {
    try {
      if (editingShift) {
        await updateShift({ ...editingShift, ...formData });
        setEditingShift(null);
      } else {
        await addShift(formData as Omit<Shift, 'id'>);
      }
      setShowAddForm(false);
      setSelectedDate(null);
    } catch (error) {
      console.error('Error saving shift:', error);
      alert('Failed to save shift. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await deleteShift(id);
      } catch (error) {
        console.error('Error deleting shift:', error);
        alert('Failed to delete shift. Please try again.');
      }
    }
  };

  // Get shift type color
  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'morning': return 'bg-yellow-100 text-yellow-800';
      case 'afternoon': return 'bg-blue-100 text-blue-800';
      case 'night': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'doctor': return <FaUserMd className="w-3 h-3" />;
      case 'nurse': return <FaUserNurse className="w-3 h-3" />;
      default: return <FaUsers className="w-3 h-3" />;
    }
  };

  if (shiftsLoading || staffLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading schedule...</p>
        </div>
      </div>
    );
  }

  const viewDates = getViewDates();

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shift Scheduling</h1>
            <p className="text-gray-600">
              {canManageSchedule 
                ? 'Manage staff schedules and shift assignments'
                : 'View your shifts and request schedule changes'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* My Shifts Toggle for non-admin users */}
            {!canManageSchedule && (
              <button
                onClick={() => setShowMyShiftsOnly(!showMyShiftsOnly)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  showMyShiftsOnly 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showMyShiftsOnly ? 'Show All Shifts' : 'My Shifts Only'}
              </button>
            )}
            
            {/* Add/Request Shift Button */}
            {canManageSchedule ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Shift</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center space-x-2"
              >
                <FaPlus />
                <span>Request Shift</span>
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900">
              {viewType === 'week' 
                ? `Week of ${currentDate.toLocaleDateString()}`
                : currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              }
            </h2>
            
            <button
              onClick={() => navigateDate('next')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewType('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'week' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewType('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewType === 'month' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Month
              </button>
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>
        
        <div className={`grid grid-cols-7 ${viewType === 'month' ? 'grid-rows-6' : 'grid-rows-1'}`}>
          {viewDates.map((date, index) => {
            const dayShifts = getShiftsForDate(date);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`p-2 min-h-[120px] border-b border-r border-gray-200 ${
                  !isCurrentMonth && viewType === 'month' ? 'bg-gray-50' : 'bg-white'
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-blue-600' : 
                    !isCurrentMonth && viewType === 'month' ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </span>
                  {canManageSchedule && (
                    <button
                      onClick={() => {
                        setSelectedDate(date);
                        setShowAddForm(true);
                      }}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <FaPlus className="w-3 h-3 text-gray-400" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayShifts.map(shift => {
                    const staffMember = getStaffMember(shift.staffId);
                    if (!staffMember) return null;
                    
                    return (
                      <div
                        key={shift.id}
                        className={`p-2 rounded-lg text-xs ${getShiftTypeColor(shift.shiftType)} hover:shadow-md transition-shadow cursor-pointer`}
                        onClick={() => canManageSchedule && setEditingShift(shift)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            {getRoleIcon(staffMember.role)}
                            <span className="truncate">{staffMember.name}</span>
                          </div>
                          {canManageSchedule && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(shift.id);
                              }}
                              className="hover:text-red-600 transition-colors"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <div className="text-xs opacity-75">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Shifts</p>
              <p className="text-2xl font-bold text-gray-900">{filteredShifts.length}</p>
            </div>
            <FaCalendarAlt className="text-3xl text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Morning Shifts</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredShifts.filter(s => s.shiftType === 'morning').length}
              </p>
            </div>
            <FaClock className="text-3xl text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Night Shifts</p>
              <p className="text-2xl font-bold text-purple-600">
                {filteredShifts.filter(s => s.shiftType === 'night').length}
              </p>
            </div>
            <FaClock className="text-3xl text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-green-600">{departments.length}</p>
            </div>
            <FaUsers className="text-3xl text-green-500" />
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingShift) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingShift ? 'Edit Shift' : 'Add New Shift'}
            </h2>
            
            <ShiftForm
              initialData={editingShift || undefined}
              selectedDate={selectedDate}
              staff={staff}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowAddForm(false);
                setEditingShift(null);
                setSelectedDate(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Simple shift form component
const ShiftForm: React.FC<{
  initialData?: Shift;
  selectedDate?: Date | null;
  staff: Staff[];
  onSubmit: (data: Partial<Shift>) => void;
  onCancel: () => void;
}> = ({ initialData, selectedDate, staff, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    staffId: initialData?.staffId || '',
    date: initialData?.date || (selectedDate ? selectedDate.toISOString().split('T')[0] : ''),
    startTime: initialData?.startTime || '09:00',
    endTime: initialData?.endTime || '17:00',
    shiftType: initialData?.shiftType || 'morning',
    notes: initialData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
        <select
          value={formData.staffId}
          onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select staff member</option>
          {staff.map(member => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.role} - {member.department})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shift Type</label>
        <select
          value={formData.shiftType}
          onChange={(e) => setFormData(prev => ({ ...prev, shiftType: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="night">Night</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Optional notes about this shift..."
        />
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
        >
          {initialData ? 'Update' : 'Add'} Shift
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ShiftScheduling;
