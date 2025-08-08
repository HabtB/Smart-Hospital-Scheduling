import { Timestamp } from 'firebase/firestore';

// User and Staff Types
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'supervisor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  departments?: string[];
  certifications?: string[];
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Staff extends UserProfile {
  // Staff-specific properties can be added here
}

export interface StaffData {
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  departments?: string[];
  certifications?: string[];
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Shift Types
export type ShiftStatus = 'open' | 'filled' | 'cancelled' | 'understaffed' | 'active';

export interface Shift {
  id: string;
  departmentId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  requiredRole?: string;
  requiredCertifications?: string[];
  assignedStaffId?: string;
  status: ShiftStatus;
  createdAt: Timestamp;
  assignedAt?: Timestamp;
}

export interface ShiftData {
  departmentId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  requiredRole?: string;
  requiredCertifications?: string[];
  assignedStaffId?: string;
  status?: ShiftStatus;
  createdAt?: any;
}

// Activity Types
export interface Activity {
  id: string;
  type: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Timestamp;
}

export interface ActivityMetadata {
  [key: string]: any;
}

// Department Types
export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  reasons: string[];
}

// Hook Return Types
export interface UseStaffReturn {
  staff: Staff[];
  loading: boolean;
  error: Error | null;
}

export interface UseShiftsReturn {
  shifts: Shift[];
  loading: boolean;
  error: Error | null;
}

export interface UseActivityFeedReturn {
  activities: Activity[];
  loading: boolean;
}

export interface UseLoginReturn {
  user: UserProfile | null;
  loading: boolean;
  error: Error | null;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface StaffForm {
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  certifications: string[];
}

export interface ShiftForm {
  departmentId: string;
  startTime: Date;
  endTime: Date;
  requiredRole?: string;
  requiredCertifications: string[];
}

// Request Types
export interface ShiftRequest {
  id: string;
  staffId: string;
  shiftId: string;
  type: 'swap' | 'cover' | 'time_off';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  requestedDate: Timestamp;
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
}

export interface Request {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'time_off' | 'shift_swap' | 'schedule_change';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  priority?: 'normal' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'shift_change' | 'request_approved' | 'request_rejected' | 'new_request' | 'coverage_needed' | 'schedule_update' | 'system_alert';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  userId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: {
    shiftId?: string;
    requestId?: string;
    departmentId?: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}