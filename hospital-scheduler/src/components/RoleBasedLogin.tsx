import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/MockAuthContext';
import type { UserRole } from '../types/auth';
import { 
  FaUserMd, 
  FaUserNurse, 
  FaShieldAlt, 
  FaStethoscope, 
  FaHospital,
  FaSignInAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

interface LoginForm {
  email: string;
  password: string;
  role: UserRole;
}

const RoleBasedLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    role: 'admin'
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles: Array<{ value: UserRole; label: string; icon: React.ComponentType<any>; color: string; description: string }> = [
    { 
      value: 'admin', 
      label: 'Administrator', 
      icon: FaShieldAlt, 
      color: 'purple',
      description: 'Full system access and user management'
    },
    { 
      value: 'supervisor', 
      label: 'Supervisor', 
      icon: FaStethoscope, 
      color: 'indigo',
      description: 'Staff and schedule management'
    },
    { 
      value: 'doctor', 
      label: 'Doctor', 
      icon: FaUserMd, 
      color: 'blue',
      description: 'View schedules and submit requests'
    },
    { 
      value: 'nurse', 
      label: 'Nurse', 
      icon: FaUserNurse, 
      color: 'green',
      description: 'View schedules and submit requests'
    }
  ];

  // Demo accounts for quick testing
  const demoAccounts = [
    { email: 'admin@hospital.com', password: 'demo123', role: 'admin' as UserRole },
    { email: 'supervisor@hospital.com', password: 'demo123', role: 'supervisor' as UserRole },
    { email: 'doctor@hospital.com', password: 'demo123', role: 'doctor' as UserRole },
    { email: 'nurse@hospital.com', password: 'demo123', role: 'nurse' as UserRole }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password, formData.role);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demo: typeof demoAccounts[0]) => {
    setLoading(true);
    setError('');
    try {
      await login(demo.email, demo.password, demo.role);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };



  const selectedRole = roles.find(r => r.value === formData.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-center text-white space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-6">
              <FaHospital className="text-4xl text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Smart Hospital Scheduler</h1>
            <p className="text-xl text-blue-200 mb-8">Efficient healthcare workforce management</p>
            
            {/* Role Showcase */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <div key={role.value} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex justify-center mb-2">
                      <Icon className={`text-2xl text-${role.color}-300`} />
                    </div>
                    <h3 className="font-semibold text-sm">{role.label}</h3>
                    <p className="text-xs text-gray-300 mt-1">{role.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-4">
                <FaSignInAlt className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome Back
              </h2>
              <p className="text-gray-600 mt-2">
                Sign in to your hospital account
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = formData.role === role.value;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.value })}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `border-${role.color}-500 bg-${role.color}-50 text-${role.color}-700`
                            : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-center mb-1">
                          <Icon className="text-xl" />
                        </div>
                        <div className="text-xs font-medium">{role.label}</div>
                      </button>
                    );
                  })}
                </div>
                {selectedRole && (
                  <p className="text-xs text-gray-500 mt-2">{selectedRole.description}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Please wait...' : 'Sign In'}
              </button>
            </form>



            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-4">Quick Demo Access:</p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((demo) => {
                  const roleConfig = roles.find(r => r.value === demo.role);
                  const Icon = roleConfig?.icon || FaStethoscope;
                  return (
                    <button
                      key={demo.role}
                      onClick={() => handleDemoLogin(demo)}
                      disabled={loading}
                      className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
                        loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="text-sm mb-1 mx-auto" />
                      <div className="capitalize">{demo.role}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedLogin;
