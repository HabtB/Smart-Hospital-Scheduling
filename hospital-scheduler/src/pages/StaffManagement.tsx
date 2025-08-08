import React, { useState, useMemo } from 'react';
import { useStaff } from '../hooks/useRealtimeData';
import { staffService } from '../services/firebaseService';
import type { StaffData, UserRole } from '../types';
import { useAuth } from '../context/MockAuthContext';
import { useNotificationService, NotificationService } from '../services/notificationService';
import { 
  FaUsers, 
  FaUserPlus, 
  FaSearch,
  FaFilter,
  FaUserMd,
  FaUserNurse,
  FaStethoscope,
  FaShieldAlt,
  FaEye,
  FaEdit,
  FaUserTimes,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaExclamationCircle,
  FaIdBadge,
  FaChartBar,
  FaPlus,
  FaBell
} from 'react-icons/fa';

const StaffManagement: React.FC = () => {
  const { staff, loading, error } = useStaff();
  const { createUser, userProfile } = useAuth();
  const notificationService = useNotificationService();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tempPassword, setTempPassword] = useState<string>('');
  const [userCreateSuccess, setUserCreateSuccess] = useState<boolean>(false);
  const [createdUserInfo, setCreatedUserInfo] = useState<{name: string, email: string, role: string} | null>(null);
  const [userCreateLoading, setUserCreateLoading] = useState(false);
  const [userCreateError, setUserCreateError] = useState<string>('');
  
  const [formData, setFormData] = useState<StaffData>({
    name: '',
    email: '',
    role: 'nurse',
    departmentId: '',
    certifications: [],
    isActive: true
  });

  // User creation form data (for login credentials)
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'nurse' as UserRole,
    departmentId: ''
  });

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set<string>();
    staff.forEach(s => depts.add(s.departmentId));
    return Array.from(depts).sort();
  }, [staff]);

  // Filter staff based on search and filters
  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch = searchTerm === '' || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.departmentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || member.role === filterRole;
      const matchesDepartment = filterDepartment === 'all' || member.departmentId === filterDepartment;
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && member.isActive) ||
        (filterStatus === 'inactive' && !member.isActive);
      
      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  }, [staff, searchTerm, filterRole, filterDepartment, filterStatus]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await staffService.createStaff(formData);
      
      // Trigger real-time notification for staff member addition
      NotificationService.onStaffMemberAdded(
        formData.name,
        formData.departmentId,
        userProfile?.name || 'Admin'
      );
      
      setShowCreateForm(false);
      setFormData({
        name: '',
        email: '',
        role: 'nurse',
        departmentId: '',
        certifications: [],
        isActive: true
      });
    } catch (error) {
      console.error('Error creating staff:', error);
    }
  };

  const handleDeactivateStaff = async (staffId: string) => {
    if (window.confirm('Are you sure you want to deactivate this staff member?')) {
      try {
        await staffService.deactivateStaff(staffId);
      } catch (error) {
        console.error('Error deactivating staff:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Unified employee onboarding - creates both user account and staff record
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userProfile?.role !== 'admin') {
      setUserCreateError('Only administrators can create employees');
      return;
    }

    setUserCreateLoading(true);
    setUserCreateError('');
    setTempPassword('');
    
    try {
      // Step 1: Create user account (login credentials)
      const temporaryPassword = await createUser(
        userFormData.email,
        userFormData.role,
        userFormData.name,
        userFormData.departmentId
      );
      
      // Step 2: Create staff record (HR/scheduling data)
      const staffData: StaffData = {
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        departmentId: userFormData.departmentId,
        certifications: [],
        isActive: true
      };
      
      await staffService.createStaff(staffData);
      
      // Step 3: Show unified success state
      setTempPassword(temporaryPassword);
      setUserCreateSuccess(true);
      setCreatedUserInfo({
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role
      });
      
      // Reset form
      setUserFormData({
        name: '',
        email: '',
        role: 'nurse',
        departmentId: ''
      });
      
    } catch (error: any) {
      setUserCreateError(error.message || 'Failed to create employee');
    } finally {
      setUserCreateLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
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

  const getRoleBadgeColor = (role: string) => {
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

  const getStatsCards = () => {
    const activeStaff = staff.filter(s => s.isActive);
    const doctors = staff.filter(s => s.role === 'doctor');
    const nurses = staff.filter(s => s.role === 'nurse');
    
    return [
      {
        title: "Total Staff",
        value: staff.length,
        subtitle: `${activeStaff.length} active`,
        icon: FaUsers,
        color: 'from-blue-500 to-blue-600'
      },
      {
        title: "Doctors",
        value: doctors.length,
        subtitle: `${doctors.filter(d => d.isActive).length} active`,
        icon: FaUserMd,
        color: 'from-purple-500 to-purple-600'
      },
      {
        title: "Nurses",
        value: nurses.length,
        subtitle: `${nurses.filter(n => n.isActive).length} active`,
        icon: FaUserNurse,
        color: 'from-green-500 to-green-600'
      },
      {
        title: "Departments",
        value: departments.length,
        subtitle: "Active units",
        icon: FaIdBadge,
        color: 'from-orange-500 to-red-500'
      }
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <FaExclamationCircle className="mr-2" />
        Error loading staff: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FaUsers className="mr-3 text-blue-600" />
            Staff Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your hospital team members and their assignments</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid View
            </button>
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
          <div className="flex space-x-4">
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg transform hover:scale-105"
            >
              <FaUserPlus className="mr-2" />
              <div className="text-left">
                <div className="font-semibold">Add Staff Member</div>
                <div className="text-xs opacity-90">HR record only • No system access</div>
              </div>
            </button>
            {userProfile?.role === 'admin' && (
              <>
                <button
                  onClick={() => setShowUserForm(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center shadow-lg transform hover:scale-105"
                >
                  <FaPlus className="mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">Create Employee Account</div>
                    <div className="text-xs opacity-90">HR record + Login access</div>
                  </div>
                </button>
                <button
                  onClick={() => NotificationService.triggerDemoNotifications()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center shadow-lg transform hover:scale-105"
                >
                  <FaBell className="mr-2" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">Test Notifications</div>
                    <div className="text-xs opacity-90">Demo real-time alerts</div>
                  </div>
                </button>
              </>
            )}
          </div>
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
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
            </select>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaFilter className="mr-2" />
            {filteredStaff.length} of {staff.length} staff
          </div>
        </div>
      </div>

      {/* Create Staff Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <FaUserPlus className="mr-3 text-blue-600" />
                Add New Staff Member
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleCreateStaff} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                    <option value="supervisor">Supervisor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="departmentId"
                    required
                    value={formData.departmentId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter department"
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
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Display */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or add a new staff member.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Staff Member
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden transform hover:scale-105">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      {getRoleIcon(member.role)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    {member.email}
                  </div>
                  <div className="flex items-center">
                    <FaIdBadge className="mr-2 text-gray-400" />
                    {member.departmentId}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    member.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      <FaEye />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
                      <FaEdit />
                    </button>
                    {member.isActive && (
                      <button
                        onClick={() => handleDeactivateStaff(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <FaUserTimes />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Staff Members ({filteredStaff.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
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
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mr-4">
                          {getRoleIcon(member.role)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.departmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 p-1">
                          <FaEye />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900 p-1">
                          <FaEdit />
                        </button>
                        {member.isActive && (
                          <button
                            onClick={() => handleDeactivateStaff(member.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <FaUserTimes />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Creation Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Employee</h2>
                <button
                  onClick={() => {
                    setShowUserForm(false);
                    setUserCreateError('');
                    setTempPassword('');
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleCreateEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={userFormData.name}
                    onChange={handleUserFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userFormData.email}
                    onChange={handleUserFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="departmentId"
                    value={userFormData.departmentId}
                    onChange={handleUserFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Emergency">Emergency</option>
                    <option value="ICU">ICU</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Nursing">Nursing</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {userCreateError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <FaExclamationCircle className="inline mr-2" />
                    {userCreateError}
                  </div>
                )}

                {userCreateSuccess && createdUserInfo && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <div className="flex items-center">
                      <FaCheck className="mr-2" />
                      <div>
                        <p className="font-medium">Employee created successfully!</p>
                        <p className="text-sm mt-1">
                          <strong>Temporary Password:</strong> 
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded ml-2">{tempPassword}</span>
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Employee Information:</strong> 
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded ml-2">{createdUserInfo.name} ({createdUserInfo.email}) - {createdUserInfo.role}</span>
                        </p>
                        <p className="text-xs mt-2 text-green-600">
                          Please share this temporary password with the employee. They will be required to change it on first login.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      setUserCreateError('');
                      setTempPassword('');
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={userCreateLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {userCreateLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      'Create Employee'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
