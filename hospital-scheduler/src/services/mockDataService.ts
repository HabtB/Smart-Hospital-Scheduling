import { 
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
} from '../data/mockData';

/**
 * Mock Data Service
 * 
 * This service provides mock data for testing and development purposes.
 * It simulates API calls and Firebase operations with realistic delays.
 */

// Simulate API delay
const simulateDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

export class MockDataService {
  
  // Staff Management
  static async getStaff() {
    await simulateDelay();
    return mockStaff;
  }

  static async getStaffById(id: string) {
    await simulateDelay();
    return mockStaff.find(staff => staff.id === id);
  }

  static async getStaffByDepartment(department: string) {
    await simulateDelay();
    return getStaffByDepartment(department);
  }

  static async addStaff(staffData: any) {
    await simulateDelay();
    const newStaff = {
      id: Date.now().toString(),
      ...staffData,
      isActive: true
    };
    mockStaff.push(newStaff);
    return newStaff;
  }

  static async updateStaff(id: string, updates: any) {
    await simulateDelay();
    const index = mockStaff.findIndex(staff => staff.id === id);
    if (index !== -1) {
      mockStaff[index] = { ...mockStaff[index], ...updates };
      return mockStaff[index];
    }
    throw new Error('Staff member not found');
  }

  static async deleteStaff(id: string) {
    await simulateDelay();
    const index = mockStaff.findIndex(staff => staff.id === id);
    if (index !== -1) {
      mockStaff[index].isActive = false;
      return true;
    }
    return false;
  }

  // Shift Management
  static async getShifts() {
    await simulateDelay();
    return mockShifts;
  }

  static async getShiftById(id: string) {
    await simulateDelay();
    return mockShifts.find(shift => shift.id === id);
  }

  static async getShiftsByDateRange(startDate: string, endDate: string) {
    await simulateDelay();
    return getShiftsByDateRange(startDate, endDate);
  }

  static async getShiftsByDepartment(department: string) {
    await simulateDelay();
    return mockShifts.filter(shift => shift.department === department);
  }

  static async addShift(shiftData: any) {
    await simulateDelay();
    const newShift = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...shiftData,
      assignedStaff: [],
      status: 'understaffed'
    };
    mockShifts.push(newShift);
    return newShift;
  }

  static async updateShift(id: string, updates: any) {
    await simulateDelay();
    const index = mockShifts.findIndex(shift => shift.id === id);
    if (index !== -1) {
      mockShifts[index] = { ...mockShifts[index], ...updates };
      return mockShifts[index];
    }
    throw new Error('Shift not found');
  }

  static async assignStaffToShift(shiftId: string, staffId: string) {
    await simulateDelay();
    const shift = mockShifts.find(s => s.id === shiftId);
    if (shift && !shift.assignedStaff.includes(staffId)) {
      shift.assignedStaff.push(staffId);
      shift.status = shift.assignedStaff.length >= shift.staffRequired ? 'active' : 'understaffed';
      return shift;
    }
    throw new Error('Shift not found or staff already assigned');
  }

  static async removeStaffFromShift(shiftId: string, staffId: string) {
    await simulateDelay();
    const shift = mockShifts.find(s => s.id === shiftId);
    if (shift) {
      shift.assignedStaff = shift.assignedStaff.filter(id => id !== staffId);
      shift.status = shift.assignedStaff.length >= shift.staffRequired ? 'active' : 'understaffed';
      return shift;
    }
    throw new Error('Shift not found');
  }

  static async deleteShift(id: string) {
    await simulateDelay();
    const index = mockShifts.findIndex(shift => shift.id === id);
    if (index !== -1) {
      mockShifts.splice(index, 1);
      return true;
    }
    return false;
  }

  // Request Management
  static async getRequests() {
    await simulateDelay();
    return mockRequests;
  }

  static async getRequestById(id: string) {
    await simulateDelay();
    return mockRequests.find(request => request.id === id);
  }

  static async getRequestsByStatus(status: 'pending' | 'approved' | 'rejected') {
    await simulateDelay();
    return getRequestsByStatus(status);
  }

  static async getRequestsByStaff(staffId: string) {
    await simulateDelay();
    return mockRequests.filter(request => request.staffId === staffId);
  }

  static async addRequest(requestData: any) {
    await simulateDelay();
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      requestDate: new Date().toISOString()
    };
    mockRequests.push(newRequest);
    return newRequest;
  }

  static async updateRequest(id: string, updates: any) {
    await simulateDelay();
    const index = mockRequests.findIndex(request => request.id === id);
    if (index !== -1) {
      mockRequests[index] = { ...mockRequests[index], ...updates };
      return mockRequests[index];
    }
    throw new Error('Request not found');
  }

  static async approveRequest(id: string, managerId: string, notes?: string) {
    await simulateDelay();
    const request = mockRequests.find(r => r.id === id);
    if (request) {
      request.status = 'approved';
      request.reviewedBy = managerId;
      if (notes) request.managerNotes = notes;
      return request;
    }
    throw new Error('Request not found');
  }

  static async rejectRequest(id: string, managerId: string, notes: string) {
    await simulateDelay();
    const request = mockRequests.find(r => r.id === id);
    if (request) {
      request.status = 'rejected';
      request.reviewedBy = managerId;
      request.managerNotes = notes;
      return request;
    }
    throw new Error('Request not found');
  }

  // Activity Feed
  static async getActivityFeed() {
    await simulateDelay();
    return mockActivityFeed;
  }

  static async getRecentActivity(hours: number = 24) {
    await simulateDelay();
    return getRecentActivity(hours);
  }

  static async addActivity(activityData: any) {
    await simulateDelay();
    const newActivity = {
      id: Date.now().toString(),
      ...activityData,
      timestamp: new Date().toISOString()
    };
    mockActivityFeed.unshift(newActivity);
    return newActivity;
  }

  // Departments
  static async getDepartments() {
    await simulateDelay();
    return mockDepartments;
  }

  static async getDepartmentById(id: string) {
    await simulateDelay();
    return mockDepartments.find(dept => dept.id === id);
  }

  static async getDepartmentByName(name: string) {
    await simulateDelay();
    return mockDepartments.find(dept => dept.name === name);
  }

  // Dashboard Statistics
  static async getStats() {
    await simulateDelay();
    return mockStats;
  }

  static async getUpdatedStats() {
    await simulateDelay();
    return {
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
  }

  // Bulk Operations
  static async bulkAssignStaff(assignments: { shiftId: string; staffIds: string[] }[]) {
    await simulateDelay(1000);
    const results = [];
    
    for (const assignment of assignments) {
      const shift = mockShifts.find(s => s.id === assignment.shiftId);
      if (shift) {
        shift.assignedStaff = [...new Set([...shift.assignedStaff, ...assignment.staffIds])];
        shift.status = shift.assignedStaff.length >= shift.staffRequired ? 'active' : 'understaffed';
        results.push(shift);
      }
    }
    
    return results;
  }

  static async generateWeeklySchedule(weekStartDate: string) {
    await simulateDelay(1500);
    // This could contain logic to auto-generate shifts for a week
    // For now, return the existing shifts in that week
    const weekEnd = new Date(weekStartDate);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    return getShiftsByDateRange(weekStartDate, weekEnd.toISOString());
  }

  // Search and Filter
  static async searchStaff(query: string) {
    await simulateDelay();
    const searchTerm = query.toLowerCase();
    return mockStaff.filter(staff => 
      staff.name.toLowerCase().includes(searchTerm) ||
      staff.department.toLowerCase().includes(searchTerm) ||
      staff.specialization.toLowerCase().includes(searchTerm) ||
      staff.role.toLowerCase().includes(searchTerm)
    );
  }

  static async filterShifts(filters: {
    department?: string;
    shiftType?: string;
    status?: string;
    dateRange?: { start: string; end: string };
  }) {
    await simulateDelay();
    let filteredShifts = [...mockShifts];

    if (filters.department) {
      filteredShifts = filteredShifts.filter(shift => shift.department === filters.department);
    }

    if (filters.shiftType) {
      filteredShifts = filteredShifts.filter(shift => shift.shiftType === filters.shiftType);
    }

    if (filters.status) {
      filteredShifts = filteredShifts.filter(shift => shift.status === filters.status);
    }

    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start);
      const end = new Date(filters.dateRange.end);
      filteredShifts = filteredShifts.filter(shift => {
        const shiftDate = new Date(shift.startTime);
        return shiftDate >= start && shiftDate <= end;
      });
    }

    return filteredShifts;
  }
}

export default MockDataService;
