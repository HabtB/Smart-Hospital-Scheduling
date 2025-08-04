import React, { useState } from 'react';
import { useStaff, useShifts } from '../hooks/useRealtimeData';
import { 
  FaChartBar, 
  FaChartLine, 
  FaCalendarAlt, 
  FaUsers, 
  FaClock, 
  FaDownload,
  FaFilter,
  FaPrint
} from 'react-icons/fa';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const { staff } = useStaff();
  const { shifts } = useShifts();

  const departments = [...new Set(staff.map(s => s.departmentId))];
  
  const filteredShifts = shifts.filter(shift => {
    if (selectedDepartment !== 'all' && shift.departmentId !== selectedDepartment) {
      return false;
    }
    // Add date filtering logic here
    return true;
  });

  const metrics = {
    totalShifts: filteredShifts.length,
    openShifts: filteredShifts.filter(s => s.status === 'open').length,
    filledShifts: filteredShifts.filter(s => s.status === 'filled').length,
    staffUtilization: staff.length > 0 ? (filteredShifts.filter(s => s.assignedStaffId).length / filteredShifts.length * 100).toFixed(1) : 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
            <p className="text-blue-100">Comprehensive insights into your scheduling data</p>
          </div>
          <FaChartBar className="text-5xl text-blue-200" />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaFilter className="mr-2 text-gray-600" />
          Report Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Shifts</p>
              <p className="text-3xl font-bold">{metrics.totalShifts}</p>
            </div>
            <FaCalendarAlt className="text-3xl text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Filled Shifts</p>
              <p className="text-3xl font-bold">{metrics.filledShifts}</p>
            </div>
            <FaUsers className="text-3xl text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Open Shifts</p>
              <p className="text-3xl font-bold">{metrics.openShifts}</p>
            </div>
            <FaClock className="text-3xl text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Utilization</p>
              <p className="text-3xl font-bold">{metrics.staffUtilization}%</p>
            </div>
            <FaChartLine className="text-3xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Shifts by Department</h3>
          <div className="space-y-3">
            {departments.map(dept => {
              const deptShifts = filteredShifts.filter(s => s.departmentId === dept).length;
              const percentage = filteredShifts.length > 0 ? (deptShifts / filteredShifts.length * 100).toFixed(1) : 0;
              return (
                <div key={dept} className="flex items-center">
                  <div className="w-24 text-sm font-medium text-gray-700">{dept}</div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-semibold text-gray-600">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shift Status */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Shift Status Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-700">Filled Shifts</span>
              </div>
              <div className="text-xl font-bold text-green-600">{metrics.filledShifts}</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-700">Open Shifts</span>
              </div>
              <div className="text-xl font-bold text-yellow-600">{metrics.openShifts}</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="font-medium text-gray-700">Cancelled Shifts</span>
              </div>
              <div className="text-xl font-bold text-red-600">
                {filteredShifts.filter(s => s.status === 'cancelled').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Export Reports</h3>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaDownload className="mr-2" />
            Export CSV
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FaPrint className="mr-2" />
            Print Report
          </button>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <FaDownload className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
