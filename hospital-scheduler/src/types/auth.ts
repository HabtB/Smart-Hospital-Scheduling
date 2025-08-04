export type UserRole = 'admin' | 'supervisor' | 'doctor' | 'nurse';

export interface UserPermissions {
  // Staff Management
  canViewStaff: boolean;
  canCreateStaff: boolean;
  canEditStaff: boolean;
  canDeleteStaff: boolean;
  
  // Shift Management
  canViewSchedule: boolean;
  canCreateShifts: boolean;
  canEditShifts: boolean;
  canDeleteShifts: boolean;
  canAssignStaff: boolean;
  
  // Request Management
  canViewRequests: boolean;
  canCreateRequests: boolean;
  canApproveRequests: boolean;
  canRejectRequests: boolean;
  
  // Reports & Analytics
  canViewReports: boolean;
  canExportData: boolean;
  
  // System Administration
  canManageUsers: boolean;
  canViewLogs: boolean;
  canConfigureSystem: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  permissions: UserPermissions;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    // Full permissions for everything
    canViewStaff: true,
    canCreateStaff: true,
    canEditStaff: true,
    canDeleteStaff: true,
    canViewSchedule: true,
    canCreateShifts: true,
    canEditShifts: true,
    canDeleteShifts: true,
    canAssignStaff: true,
    canViewRequests: true,
    canCreateRequests: true,
    canApproveRequests: true,
    canRejectRequests: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: true,
    canViewLogs: true,
    canConfigureSystem: true,
  },
  
  supervisor: {
    // Management permissions but limited system access
    canViewStaff: true,
    canCreateStaff: true,
    canEditStaff: true,
    canDeleteStaff: false, // Can't delete staff
    canViewSchedule: true,
    canCreateShifts: true,
    canEditShifts: true,
    canDeleteShifts: true,
    canAssignStaff: true,
    canViewRequests: true,
    canCreateRequests: true,
    canApproveRequests: true,
    canRejectRequests: true,
    canViewReports: true,
    canExportData: true,
    canManageUsers: false, // Can't manage users
    canViewLogs: false,
    canConfigureSystem: false,
  },
  
  doctor: {
    // Limited management, can view schedules and make requests
    canViewStaff: true,
    canCreateStaff: false,
    canEditStaff: false,
    canDeleteStaff: false,
    canViewSchedule: true,
    canCreateShifts: false,
    canEditShifts: false,
    canDeleteShifts: false,
    canAssignStaff: false,
    canViewRequests: true,
    canCreateRequests: true,
    canApproveRequests: false, // Doctors can't approve requests
    canRejectRequests: false,
    canViewReports: false,
    canExportData: false,
    canManageUsers: false,
    canViewLogs: false,
    canConfigureSystem: false,
  },
  
  nurse: {
    // Basic permissions - can view and make requests
    canViewStaff: true,
    canCreateStaff: false,
    canEditStaff: false,
    canDeleteStaff: false,
    canViewSchedule: true,
    canCreateShifts: false,
    canEditShifts: false,
    canDeleteShifts: false,
    canAssignStaff: false,
    canViewRequests: true,
    canCreateRequests: true,
    canApproveRequests: false,
    canRejectRequests: false,
    canViewReports: false,
    canExportData: false,
    canManageUsers: false,
    canViewLogs: false,
    canConfigureSystem: false,
  },
};

// Helper functions
export const getUserPermissions = (role: UserRole): UserPermissions => {
  return ROLE_PERMISSIONS[role];
};

export const hasPermission = (userRole: UserRole, permission: keyof UserPermissions): boolean => {
  const permissions = getUserPermissions(userRole);
  return permissions[permission];
};

export const canApproveRequests = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'canApproveRequests');
};

export const canManageStaff = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'canCreateStaff') || hasPermission(userRole, 'canEditStaff');
};

export const canManageSchedule = (userRole: UserRole): boolean => {
  return hasPermission(userRole, 'canCreateShifts') || hasPermission(userRole, 'canEditShifts');
};
