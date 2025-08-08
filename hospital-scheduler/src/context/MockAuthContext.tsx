import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserRole, UserProfile } from '../types/auth';
import { getUserPermissions } from '../types/auth';

interface AuthContextType {
  currentUser: any;
  userProfile: UserProfile | null;
  loading: boolean;
  mustChangePassword: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  anonymousLogin: (role: UserRole) => Promise<void>;
  createUser: (email: string, role: UserRole, name: string, departmentId: string) => Promise<string>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // Initialize users from localStorage or use defaults
  const [users, setUsers] = useState<{[key: string]: any}>(() => {
    const storedUsers = localStorage.getItem('hospitalUsers');
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error('Error parsing stored users:', error);
      }
    }
    // Default demo users
    return {
      'admin@hospital.com': {
        email: 'admin@hospital.com',
        password: 'demo123',
        name: 'Dr. Sarah Admin',
        role: 'admin' as UserRole,
        department: 'Administration'
      },
      'supervisor@hospital.com': {
        email: 'supervisor@hospital.com',
        password: 'demo123',
        name: 'Jane Smith',
        role: 'supervisor' as UserRole,
        department: 'Emergency'
      },
      'doctor@hospital.com': {
        email: 'doctor@hospital.com',
        password: 'demo123',
        name: 'Dr. Michael Johnson',
        role: 'doctor' as UserRole,
        department: 'Cardiology'
      },
      'nurse@hospital.com': {
        email: 'nurse@hospital.com',
        password: 'demo123',
        name: 'Emily Johnson',
        role: 'nurse' as UserRole,
        department: 'ICU'
      }
    };
  });

  // Initialize users from localStorage and check for existing user session on mount
  useEffect(() => {
    // Load users from localStorage and merge with default users
    const storedUsers = localStorage.getItem('hospitalUsers');
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        console.log('🔄 Loading users from localStorage:', parsedUsers);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error parsing stored users:', error);
        localStorage.removeItem('hospitalUsers');
      }
    }
    
    // Check for existing user session
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setUserProfile(createUserProfile(userData));
        
        // Check if user must change password
        if (userData.mustChangePassword) {
          setMustChangePassword(true);
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('mockUser');
      }
    }
    setLoading(false);
  }, []);

  // Update localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('hospitalUsers', JSON.stringify(users));
  }, [users]);

  const createUserProfile = (userData: any): UserProfile => {
    return {
      id: userData.email,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      department: userData.department,
      permissions: getUserPermissions(userData.role),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
  };

  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    console.log('🔑 Login attempt:', { email, password, role });
    console.log('🔑 All users:', users);
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists and password matches
      const user = users[email];
      console.log('🔑 Found user:', user);
      
      if (!user) {
        console.log('🔑 User not found for email:', email);
        throw new Error('Invalid email or password');
      }
      
      if (user.password !== password) {
        console.log('🔑 Password mismatch. Expected:', user.password, 'Got:', password);
        throw new Error('Invalid email or password');
      }

      console.log('🔑 Login successful, mustChangePassword:', user.mustChangePassword);
      
      // Use the user's actual role from the database, not the form role
      const userWithRole = { ...user, role: user.role };
      const profile = createUserProfile(userWithRole);

      setCurrentUser(userWithRole);
      setUserProfile(profile);
      
      // Check if user must change password
      if (user.mustChangePassword) {
        console.log('🔑 Setting mustChangePassword to true');
        setMustChangePassword(true);
      } else {
        console.log('🔑 Setting mustChangePassword to false');
        setMustChangePassword(false);
      }
      
      // Store session
      localStorage.setItem('mockUser', JSON.stringify(userWithRole));
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const anonymousLogin = async (role: UserRole): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const anonymousUser = {
        email: `anonymous@${role}.com`,
        name: `Anonymous ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        role,
        department: 'Demo'
      };

      const profile = createUserProfile(anonymousUser);
      setCurrentUser(anonymousUser);
      setUserProfile(profile);
      
      // Store session
      localStorage.setItem('mockUser', JSON.stringify(anonymousUser));
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('mockUser');
      
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentForRole = (role: UserRole): string => {
    switch (role) {
      case 'admin':
        return 'Administration';
      case 'supervisor':
        return 'Management';
      case 'doctor':
        return 'Medical';
      case 'nurse':
        return 'Nursing';
      default:
        return 'General';
    }
  };

  // Admin-only function to create users with temporary passwords
  const createUser = async (email: string, role: UserRole, name: string, departmentId: string): Promise<string> => {
    console.log('🔥 createUser called with:', { email, role, name, departmentId });
    console.log('🔥 Current user:', currentUser);
    console.log('🔥 User profile:', userProfile);
    
    if (!currentUser || userProfile?.role !== 'admin') {
      throw new Error('Only administrators can create users');
    }

    // Simulate network delay without affecting global loading state
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (users[email]) {
      throw new Error('User already exists');
    }

    // Generate temporary password
    const tempPassword = `temp${Math.random().toString(36).substr(2, 6)}`;
    console.log('🔥 Generated temp password:', tempPassword);
    
    const newUser = {
      email,
      password: tempPassword,
      name,
      role,
      departmentId,
      department: getDepartmentForRole(role),
      permissions: getUserPermissions(role),
      isActive: true,
      mustChangePassword: true // Flag to force password change on first login
    };

    console.log('🔥 New user created:', newUser);
    
    const updatedUsers = { ...users, [email]: newUser };
    setUsers(updatedUsers);
    localStorage.setItem('hospitalUsers', JSON.stringify(updatedUsers));
    
    console.log('🔥 Returning temp password:', tempPassword);
    return tempPassword;
  };

  // Function to change password for users with temporary passwords
  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    if (!currentUser) {
      throw new Error('User not logged in');
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify current password
    const user = users[currentUser.email];
    if (!user || user.password !== currentPassword) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    const updatedUser = {
      ...user,
      password: newPassword,
      mustChangePassword: false // Clear the flag
    };

    const updatedUsers = { ...users, [currentUser.email]: updatedUser };
    setUsers(updatedUsers);
    localStorage.setItem('hospitalUsers', JSON.stringify(updatedUsers));
    
    // Update current user session
    const updatedCurrentUser = { ...currentUser, password: newPassword, mustChangePassword: false };
    setCurrentUser(updatedCurrentUser);
    setMustChangePassword(false);
    localStorage.setItem('mockUser', JSON.stringify(updatedCurrentUser));
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    mustChangePassword,
    login,
    logout,
    anonymousLogin,
    createUser,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
