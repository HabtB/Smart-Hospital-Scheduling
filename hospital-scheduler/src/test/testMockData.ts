import { MockDataService } from '../services/mockDataService';
import { StaffMember, Shift, Request } from '../types';

// Initialize the mock data service
const mockService = new MockDataService();

/**
 * Test all mock data service methods
 */
export const testMockDataService = async () => {
  console.log('🧪 Testing Mock Data Service...\n');

  try {
    // Test staff operations
    console.log('👥 Testing Staff Operations:');
    const staff = await mockService.getStaff();
    console.log(`✅ Retrieved ${staff.length} staff members`);

    const doctors = await mockService.getStaffByRole('doctor');
    console.log(`✅ Retrieved ${doctors.length} doctors`);

    const emergencyStaff = await mockService.getStaffByDepartment('Emergency');
    console.log(`✅ Retrieved ${emergencyStaff.length} emergency staff`);

    // Test shift operations
    console.log('\n📅 Testing Shift Operations:');
    const shifts = await mockService.getShifts();
    console.log(`✅ Retrieved ${shifts.length} shifts`);

    const todayShifts = await mockService.getShiftsForDate(new Date());
    console.log(`✅ Retrieved ${todayShifts.length} shifts for today`);

    // Test request operations
    console.log('\n📋 Testing Request Operations:');
    const requests = await mockService.getRequests();
    console.log(`✅ Retrieved ${requests.length} requests`);

    const pendingRequests = await mockService.getRequestsByStatus('pending');
    console.log(`✅ Retrieved ${pendingRequests.length} pending requests`);

    // Test activity operations
    console.log('\n🔄 Testing Activity Operations:');
    const activity = await mockService.getActivity();
    console.log(`✅ Retrieved ${activity.length} activity items`);

    // Test dashboard stats
    console.log('\n📊 Testing Dashboard Stats:');
    const stats = await mockService.getDashboardStats();
    console.log(`✅ Retrieved dashboard stats:`, {
      totalStaff: stats.totalStaff,
      totalShifts: stats.totalShifts,
      pendingRequests: stats.pendingRequests,
      departments: stats.departments
    });

    // Test CRUD operations
    console.log('\n🔧 Testing CRUD Operations:');
    
    // Create a new staff member
    const newStaff: Omit<StaffMember, 'id'> = {
      name: 'Test Doctor',
      email: 'test@hospital.com',
      role: 'doctor',
      department: 'Emergency',
      phone: '555-0123',
      certifications: ['BLS', 'ACLS'],
      availability: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' },
        saturday: null,
        sunday: null
      },
      preferences: {
        preferredShifts: ['day'],
        maxConsecutiveDays: 5,
        minDaysBetweenShifts: 1
      }
    };

    const createdStaff = await mockService.createStaff(newStaff);
    console.log(`✅ Created staff member: ${createdStaff.name}`);

    // Update the staff member
    const updatedStaff = await mockService.updateStaff(createdStaff.id, {
      ...createdStaff,
      phone: '555-9999'
    });
    console.log(`✅ Updated staff member phone: ${updatedStaff.phone}`);

    // Test request approval
    const firstPendingRequest = pendingRequests[0];
    if (firstPendingRequest) {
      await mockService.approveRequest(firstPendingRequest.id);
      console.log(`✅ Approved request: ${firstPendingRequest.id}`);
    }

    console.log('\n🎉 All tests passed! Mock data service is working correctly.\n');
    
    return {
      success: true,
      results: {
        staffCount: staff.length,
        shiftCount: shifts.length,
        requestCount: requests.length,
        activityCount: activity.length,
        stats
      }
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Test data integrity and relationships
 */
export const testDataIntegrity = async () => {
  console.log('🔍 Testing Data Integrity...\n');

  try {
    const staff = await mockService.getStaff();
    const shifts = await mockService.getShifts();
    const requests = await mockService.getRequests();

    // Check staff-shift relationships
    let validAssignments = 0;
    let invalidAssignments = 0;

    shifts.forEach(shift => {
      shift.assignedStaff.forEach(staffId => {
        const staffExists = staff.find(s => s.id === staffId);
        if (staffExists) {
          validAssignments++;
        } else {
          invalidAssignments++;
          console.warn(`⚠️ Invalid staff assignment: ${staffId} in shift ${shift.id}`);
        }
      });
    });

    console.log(`✅ Valid staff assignments: ${validAssignments}`);
    console.log(`❌ Invalid staff assignments: ${invalidAssignments}`);

    // Check request-staff relationships
    let validRequestStaff = 0;
    let invalidRequestStaff = 0;

    requests.forEach(request => {
      const staffExists = staff.find(s => s.name === request.staffName);
      if (staffExists) {
        validRequestStaff++;
      } else {
        invalidRequestStaff++;
        console.warn(`⚠️ Invalid request staff: ${request.staffName} in request ${request.id}`);
      }
    });

    console.log(`✅ Valid request staff references: ${validRequestStaff}`);
    console.log(`❌ Invalid request staff references: ${invalidRequestStaff}`);

    // Check data consistency
    const departments = new Set(staff.map(s => s.department));
    const shiftDepartments = new Set(shifts.map(s => s.department));
    const missingDepartments = Array.from(shiftDepartments).filter(d => !departments.has(d));

    if (missingDepartments.length > 0) {
      console.warn(`⚠️ Shifts reference departments not found in staff: ${missingDepartments.join(', ')}`);
    } else {
      console.log('✅ All shift departments have corresponding staff');
    }

    console.log('\n🎯 Data integrity check complete!\n');

    return {
      success: invalidAssignments === 0 && invalidRequestStaff === 0 && missingDepartments.length === 0,
      summary: {
        validAssignments,
        invalidAssignments,
        validRequestStaff,
        invalidRequestStaff,
        missingDepartments
      }
    };

  } catch (error) {
    console.error('❌ Data integrity test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Performance test for mock data operations
 */
export const testPerformance = async () => {
  console.log('⚡ Testing Performance...\n');

  const startTime = performance.now();

  try {
    // Run multiple operations concurrently
    const operations = await Promise.all([
      mockService.getStaff(),
      mockService.getShifts(),
      mockService.getRequests(),
      mockService.getActivity(),
      mockService.getDashboardStats(),
      mockService.getStaffByRole('doctor'),
      mockService.getStaffByDepartment('Emergency'),
      mockService.getRequestsByStatus('pending'),
      mockService.getShiftsForDate(new Date())
    ]);

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    console.log(`✅ Completed ${operations.length} operations in ${totalTime.toFixed(2)}ms`);
    console.log(`⚡ Average time per operation: ${(totalTime / operations.length).toFixed(2)}ms`);

    return {
      success: true,
      totalTime,
      averageTime: totalTime / operations.length,
      operationCount: operations.length
    };

  } catch (error) {
    console.error('❌ Performance test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Run all tests
 */
export const runAllTests = async () => {
  console.log('🚀 Running All Mock Data Tests...\n');
  console.log('=' .repeat(50));

  const serviceTest = await testMockDataService();
  const integrityTest = await testDataIntegrity();
  const performanceTest = await testPerformance();

  console.log('=' .repeat(50));
  console.log('📋 Test Summary:');
  console.log(`Mock Data Service: ${serviceTest.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Data Integrity: ${integrityTest.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Performance: ${performanceTest.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('=' .repeat(50));

  return {
    allPassed: serviceTest.success && integrityTest.success && performanceTest.success,
    results: {
      service: serviceTest,
      integrity: integrityTest,
      performance: performanceTest
    }
  };
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testMockData = {
    testMockDataService,
    testDataIntegrity,
    testPerformance,
    runAllTests
  };
}
