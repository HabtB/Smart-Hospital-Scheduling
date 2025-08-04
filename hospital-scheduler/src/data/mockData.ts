import { StaffMember, Shift, ActivityFeedItem } from '../types';
import type { Request } from '../types';

// Mock Staff Members
export const mockStaff: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@hospital.com',
    role: 'doctor',
    department: 'Emergency',
    specialization: 'Emergency Medicine',
    isActive: true,
    phoneNumber: '(555) 123-4567',
    hireDate: '2020-03-15',
    shiftPreference: 'day',
    certifications: ['ACLS', 'BLS', 'ATLS'],
    availableHours: 40,
    totalHours: 168
  },
  {
    id: '2',
    name: 'Nurse Emily Rodriguez',
    email: 'emily.rodriguez@hospital.com',
    role: 'nurse',
    department: 'ICU',
    specialization: 'Critical Care',
    isActive: true,
    phoneNumber: '(555) 234-5678',
    hireDate: '2019-08-20',
    shiftPreference: 'night',
    certifications: ['RN', 'BLS', 'CCRN'],
    availableHours: 36,
    totalHours: 168
  },
  {
    id: '3',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@hospital.com',
    role: 'doctor',
    department: 'Surgery',
    specialization: 'Orthopedic Surgery',
    isActive: true,
    phoneNumber: '(555) 345-6789',
    hireDate: '2018-01-10',
    shiftPreference: 'day',
    certifications: ['MD', 'ABOS', 'BLS'],
    availableHours: 50,
    totalHours: 168
  },
  {
    id: '4',
    name: 'Nurse Jennifer Martinez',
    email: 'jennifer.martinez@hospital.com',
    role: 'nurse',
    department: 'Pediatrics',
    specialization: 'Pediatric Nursing',
    isActive: true,
    phoneNumber: '(555) 456-7890',
    hireDate: '2021-05-12',
    shiftPreference: 'day',
    certifications: ['RN', 'BLS', 'PALS'],
    availableHours: 32,
    totalHours: 168
  },
  {
    id: '5',
    name: 'Admin Lisa Thompson',
    email: 'lisa.thompson@hospital.com',
    role: 'admin',
    department: 'Administration',
    specialization: 'HR Management',
    isActive: true,
    phoneNumber: '(555) 567-8901',
    hireDate: '2017-11-03',
    shiftPreference: 'day',
    certifications: ['PHR', 'SHRM-CP'],
    availableHours: 40,
    totalHours: 168
  },
  {
    id: '6',
    name: 'Nurse David Wilson',
    email: 'david.wilson@hospital.com',
    role: 'nurse',
    department: 'Emergency',
    specialization: 'Emergency Nursing',
    isActive: true,
    phoneNumber: '(555) 678-9012',
    hireDate: '2020-09-14',
    shiftPreference: 'night',
    certifications: ['RN', 'BLS', 'TNCC'],
    availableHours: 36,
    totalHours: 168
  },
  {
    id: '7',
    name: 'Dr. Amanda Foster',
    email: 'amanda.foster@hospital.com',
    role: 'doctor',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    isActive: true,
    phoneNumber: '(555) 789-0123',
    hireDate: '2019-02-28',
    shiftPreference: 'day',
    certifications: ['MD', 'ABIM', 'BLS'],
    availableHours: 45,
    totalHours: 168
  },
  {
    id: '8',
    name: 'Nurse Robert Taylor',
    email: 'robert.taylor@hospital.com',
    role: 'nurse',
    department: 'Surgery',
    specialization: 'Perioperative Nursing',
    isActive: true,
    phoneNumber: '(555) 890-1234',
    hireDate: '2018-07-19',
    shiftPreference: 'day',
    certifications: ['RN', 'BLS', 'CNOR'],
    availableHours: 40,
    totalHours: 168
  }
];

// Mock Shifts
export const mockShifts: Shift[] = [
  {
    id: '1',
    title: 'Emergency Day Shift',
    department: 'Emergency',
    startTime: '2024-01-20T07:00:00',
    endTime: '2024-01-20T19:00:00',
    staffRequired: 3,
    assignedStaff: ['1', '6'],
    shiftType: 'day',
    status: 'active',
    description: 'Emergency department day shift coverage'
  },
  {
    id: '2',
    title: 'ICU Night Shift',
    department: 'ICU',
    startTime: '2024-01-20T19:00:00',
    endTime: '2024-01-21T07:00:00',
    staffRequired: 2,
    assignedStaff: ['2'],
    shiftType: 'night',
    status: 'understaffed',
    description: 'ICU night shift - critical care coverage'
  },
  {
    id: '3',
    title: 'Surgery Morning',
    department: 'Surgery',
    startTime: '2024-01-21T06:00:00',
    endTime: '2024-01-21T14:00:00',
    staffRequired: 4,
    assignedStaff: ['3', '8'],
    shiftType: 'day',
    status: 'understaffed',
    description: 'Morning surgery schedule'
  },
  {
    id: '4',
    title: 'Pediatrics Day',
    department: 'Pediatrics',
    startTime: '2024-01-21T08:00:00',
    endTime: '2024-01-21T20:00:00',
    staffRequired: 2,
    assignedStaff: ['4'],
    shiftType: 'day',
    status: 'understaffed',
    description: 'Pediatrics day shift coverage'
  },
  {
    id: '5',
    title: 'Cardiology Day',
    department: 'Cardiology',
    startTime: '2024-01-22T08:00:00',
    endTime: '2024-01-22T18:00:00',
    staffRequired: 2,
    assignedStaff: ['7'],
    shiftType: 'day',
    status: 'understaffed',
    description: 'Cardiology procedures and consultations'
  },
  {
    id: '6',
    title: 'Emergency Night Coverage',
    department: 'Emergency',
    startTime: '2024-01-22T19:00:00',
    endTime: '2024-01-23T07:00:00',
    staffRequired: 2,
    assignedStaff: ['6'],
    shiftType: 'night',
    status: 'understaffed',
    description: 'Emergency department night coverage'
  }
];

// Mock Requests
export const mockRequests: Request[] = [
  {
    id: '1',
    staffId: '2',
    staffName: 'Emily Rodriguez',
    type: 'time-off',
    status: 'pending',
    requestDate: '2024-01-15T10:30:00',
    startDate: '2024-01-25T00:00:00',
    endDate: '2024-01-27T23:59:59',
    reason: 'Family vacation - pre-planned trip',
    urgency: 'low',
    affectedShifts: ['2'],
    managerNotes: '',
    requestedBy: '2',
    reviewedBy: undefined
  },
  {
    id: '2',
    staffId: '4',
    staffName: 'Jennifer Martinez',
    type: 'shift-swap',
    status: 'approved',
    requestDate: '2024-01-16T14:20:00',
    startDate: '2024-01-21T08:00:00',
    endDate: '2024-01-21T20:00:00',
    reason: 'Need to attend medical conference',
    urgency: 'medium',
    affectedShifts: ['4'],
    managerNotes: 'Approved - coverage arranged',
    requestedBy: '4',
    reviewedBy: '5',
    swapWith: '6'
  },
  {
    id: '3',
    staffId: '3',
    staffName: 'Michael Chen',
    type: 'overtime',
    status: 'pending',
    requestDate: '2024-01-17T09:15:00',
    startDate: '2024-01-23T14:00:00',
    endDate: '2024-01-23T22:00:00',
    reason: 'Complex surgery requiring extended time',
    urgency: 'high',
    affectedShifts: ['3'],
    managerNotes: '',
    requestedBy: '3',
    reviewedBy: undefined
  },
  {
    id: '4',
    staffId: '6',
    staffName: 'David Wilson',
    type: 'time-off',
    status: 'rejected',
    requestDate: '2024-01-18T11:45:00',
    startDate: '2024-01-24T00:00:00',
    endDate: '2024-01-24T23:59:59',
    reason: 'Personal appointment',
    urgency: 'low',
    affectedShifts: ['6'],
    managerNotes: 'Insufficient coverage available for that date',
    requestedBy: '6',
    reviewedBy: '5'
  },
  {
    id: '5',
    staffId: '1',
    staffName: 'Sarah Johnson',
    type: 'shift-swap',
    status: 'pending',
    requestDate: '2024-01-19T16:30:00',
    startDate: '2024-01-26T07:00:00',
    endDate: '2024-01-26T19:00:00',
    reason: 'Continuing education seminar',
    urgency: 'medium',
    affectedShifts: ['1'],
    managerNotes: '',
    requestedBy: '1',
    reviewedBy: undefined,
    swapWith: '6'
  }
];

// Mock Activity Feed
export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: '1',
    type: 'shift-assigned',
    message: 'Dr. Sarah Johnson assigned to Emergency Day Shift',
    staffId: '1',
    staffName: 'Dr. Sarah Johnson',
    timestamp: '2024-01-19T08:30:00',
    details: 'Emergency Day Shift - Jan 20, 7:00 AM - 7:00 PM'
  },
  {
    id: '2',
    type: 'request-submitted',
    message: 'Time-off request submitted by Emily Rodriguez',
    staffId: '2',
    staffName: 'Emily Rodriguez',
    timestamp: '2024-01-19T09:15:00',
    details: 'Family vacation: Jan 25-27, 2024'
  },
  {
    id: '3',
    type: 'request-approved',
    message: 'Shift swap approved for Jennifer Martinez',
    staffId: '4',
    staffName: 'Jennifer Martinez',
    timestamp: '2024-01-19T10:45:00',
    details: 'Pediatrics Day shift swapped with David Wilson'
  },
  {
    id: '4',
    type: 'shift-understaffed',
    message: 'ICU Night Shift is understaffed',
    staffId: null,
    staffName: null,
    timestamp: '2024-01-19T11:20:00',
    details: '1 of 2 required staff assigned for Jan 20 night shift'
  },
  {
    id: '5',
    type: 'staff-added',
    message: 'New staff member added: Dr. Amanda Foster',
    staffId: '7',
    staffName: 'Dr. Amanda Foster',
    timestamp: '2024-01-19T12:00:00',
    details: 'Cardiology Department - Interventional Cardiology'
  },
  {
    id: '6',
    type: 'overtime-requested',
    message: 'Overtime request from Dr. Michael Chen',
    staffId: '3',
    staffName: 'Dr. Michael Chen',
    timestamp: '2024-01-19T13:30:00',
    details: 'Complex surgery requiring extended time - Jan 23'
  },
  {
    id: '7',
    type: 'shift-completed',
    message: 'Emergency Night Shift completed',
    staffId: '6',
    staffName: 'David Wilson',
    timestamp: '2024-01-19T07:00:00',
    details: 'Jan 18-19 night shift - 12 hours completed'
  },
  {
    id: '8',
    type: 'request-rejected',
    message: 'Time-off request rejected for David Wilson',
    staffId: '6',
    staffName: 'David Wilson',
    timestamp: '2024-01-19T14:15:00',
    details: 'Jan 24 - Insufficient coverage available'
  }
];

// Mock Departments
export const mockDepartments = [
  {
    id: '1',
    name: 'Emergency',
    description: 'Emergency Department',
    minStaff: 2,
    maxStaff: 6,
    activeStaff: 3
  },
  {
    id: '2',
    name: 'ICU',
    description: 'Intensive Care Unit',
    minStaff: 2,
    maxStaff: 4,
    activeStaff: 2
  },
  {
    id: '3',
    name: 'Surgery',
    description: 'Surgical Department',
    minStaff: 3,
    maxStaff: 8,
    activeStaff: 4
  },
  {
    id: '4',
    name: 'Pediatrics',
    description: 'Pediatric Department',
    minStaff: 2,
    maxStaff: 4,
    activeStaff: 2
  },
  {
    id: '5',
    name: 'Cardiology',
    description: 'Cardiology Department',
    minStaff: 1,
    maxStaff: 3,
    activeStaff: 2
  },
  {
    id: '6',
    name: 'Administration',
    description: 'Hospital Administration',
    minStaff: 1,
    maxStaff: 3,
    activeStaff: 1
  }
];

// Mock Statistics for Dashboard
export const mockStats = {
  totalStaff: mockStaff.length,
  activeStaff: mockStaff.filter(s => s.isActive).length,
  totalShifts: mockShifts.length,
  understaffedShifts: mockShifts.filter(s => s.status === 'understaffed').length,
  pendingRequests: mockRequests.filter(r => r.status === 'pending').length,
  approvedRequests: mockRequests.filter(r => r.status === 'approved').length,
  rejectedRequests: mockRequests.filter(r => r.status === 'rejected').length,
  departments: mockDepartments.length,
  averageStaffPerDepartment: Math.round(mockStaff.length / mockDepartments.length),
  totalHoursScheduled: mockShifts.reduce((total, shift) => {
    const start = new Date(shift.startTime);
    const end = new Date(shift.endTime);
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, 0)
};

// Helper function to get staff by department
export const getStaffByDepartment = (department: string): StaffMember[] => {
  return mockStaff.filter(staff => staff.department === department);
};

// Helper function to get shifts by date range
export const getShiftsByDateRange = (startDate: string, endDate: string): Shift[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return mockShifts.filter(shift => {
    const shiftDate = new Date(shift.startTime);
    return shiftDate >= start && shiftDate <= end;
  });
};

// Helper function to get requests by status
export const getRequestsByStatus = (status: 'pending' | 'approved' | 'rejected'): Request[] => {
  return mockRequests.filter(request => request.status === status);
};

// Helper function to get recent activity
export const getRecentActivity = (hours: number = 24): ActivityFeedItem[] => {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hours);
  
  return mockActivityFeed.filter(item => {
    const itemDate = new Date(item.timestamp);
    return itemDate >= cutoff;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export default {
  mockStaff,
  mockShifts,
  mockRequests,
  mockActivityFeed,
  mockDepartments,
  mockStats,
  getStaffByDepartment,
  getShiftsByDateRange,
  getRequestsByStatus,
  getRecentActivity
};
