import { UserRole, UserProfile, getUserPermissions, hasPermission, ROLE_PERMISSIONS } from '../types/auth';

// Test data for role-based system validation
interface TestResult {
  test: string;
  passed: boolean;
  message: string;
}

class RoleBasedSystemTester {
  private results: TestResult[] = [];

  // Test user profiles for each role
  private testProfiles: { [key in UserRole]: UserProfile } = {
    admin: {
      id: 'admin-test',
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'admin',
      department: 'Administration',
      permissions: getUserPermissions('admin'),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    supervisor: {
      id: 'supervisor-test',
      email: 'supervisor@test.com',
      name: 'Test Supervisor',
      role: 'supervisor',
      department: 'Emergency',
      permissions: getUserPermissions('supervisor'),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    doctor: {
      id: 'doctor-test',
      email: 'doctor@test.com',
      name: 'Test Doctor',
      role: 'doctor',
      department: 'Cardiology',
      permissions: getUserPermissions('doctor'),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    },
    nurse: {
      id: 'nurse-test',
      email: 'nurse@test.com',
      name: 'Test Nurse',
      role: 'nurse',
      department: 'ICU',
      permissions: getUserPermissions('nurse'),
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
  };

  private addResult(test: string, passed: boolean, message: string) {
    this.results.push({ test, passed, message });
  }

  // Test permission mappings
  testPermissionMappings() {
    console.log('🔐 Testing Role Permission Mappings...');

    // Test admin permissions
    const adminPerms = getUserPermissions('admin');
    this.addResult(
      'Admin Full Permissions',
      adminPerms.canManageStaff && adminPerms.canManageSchedule && adminPerms.canApproveRequests && adminPerms.canViewReports,
      `Admin should have all permissions. Got: ${JSON.stringify(adminPerms)}`
    );

    // Test supervisor permissions
    const supervisorPerms = getUserPermissions('supervisor');
    this.addResult(
      'Supervisor Management Permissions',
      supervisorPerms.canManageStaff && supervisorPerms.canManageSchedule && supervisorPerms.canApproveRequests,
      `Supervisor should have management permissions. Got: ${JSON.stringify(supervisorPerms)}`
    );

    // Test doctor permissions
    const doctorPerms = getUserPermissions('doctor');
    this.addResult(
      'Doctor Limited Permissions',
      !doctorPerms.canManageStaff && !doctorPerms.canManageSchedule && doctorPerms.canViewSchedule && doctorPerms.canSubmitRequests,
      `Doctor should have limited permissions. Got: ${JSON.stringify(doctorPerms)}`
    );

    // Test nurse permissions
    const nursePerms = getUserPermissions('nurse');
    this.addResult(
      'Nurse Limited Permissions',
      !nursePerms.canManageStaff && !nursePerms.canManageSchedule && nursePerms.canViewSchedule && nursePerms.canSubmitRequests,
      `Nurse should have limited permissions. Got: ${JSON.stringify(nursePerms)}`
    );
  }

  // Test permission checking function
  testPermissionChecking() {
    console.log('✅ Testing Permission Checking Function...');

    const admin = this.testProfiles.admin;
    const doctor = this.testProfiles.doctor;

    // Test admin can manage staff
    this.addResult(
      'Admin Can Manage Staff',
      hasPermission(admin, 'canManageStaff'),
      'Admin should be able to manage staff'
    );

    // Test doctor cannot manage staff
    this.addResult(
      'Doctor Cannot Manage Staff',
      !hasPermission(doctor, 'canManageStaff'),
      'Doctor should not be able to manage staff'
    );

    // Test doctor can view schedule
    this.addResult(
      'Doctor Can View Schedule',
      hasPermission(doctor, 'canViewSchedule'),
      'Doctor should be able to view schedule'
    );

    // Test permission with non-existent permission
    this.addResult(
      'Invalid Permission Handling',
      !hasPermission(admin, 'canDeleteHospital' as any),
      'Should return false for non-existent permissions'
    );
  }

  // Test navigation access based on roles
  testNavigationAccess() {
    console.log('🧭 Testing Navigation Access...');

    const navigationItems = [
      { name: 'Dashboard', roles: ['admin', 'supervisor', 'doctor', 'nurse'] },
      { name: 'Staff Management', roles: ['admin', 'supervisor'] },
      { name: 'Shift Scheduling', roles: ['admin', 'supervisor'] },
      { name: 'Requests', roles: ['admin', 'supervisor', 'doctor', 'nurse'] },
      { name: 'Reports', roles: ['admin', 'supervisor'] },
      { name: 'Notifications', roles: ['admin', 'supervisor', 'doctor', 'nurse'] },
    ];

    // Test each role's navigation access
    Object.entries(this.testProfiles).forEach(([role, profile]) => {
      const accessibleItems = navigationItems.filter(item => 
        item.roles.includes(role as UserRole)
      );

      const expectedCounts = {
        admin: 6,
        supervisor: 6,
        doctor: 3,
        nurse: 3
      };

      this.addResult(
        `${role.charAt(0).toUpperCase() + role.slice(1)} Navigation Access`,
        accessibleItems.length === expectedCounts[role as UserRole],
        `${role} should have access to ${expectedCounts[role as UserRole]} items, got ${accessibleItems.length}`
      );
    });
  }

  // Test request approval permissions
  testRequestApprovalPermissions() {
    console.log('📋 Testing Request Approval Permissions...');

    const admin = this.testProfiles.admin;
    const supervisor = this.testProfiles.supervisor;
    const doctor = this.testProfiles.doctor;
    const nurse = this.testProfiles.nurse;

    // Test who can approve requests
    this.addResult(
      'Admin Can Approve Requests',
      hasPermission(admin, 'canApproveRequests'),
      'Admin should be able to approve requests'
    );

    this.addResult(
      'Supervisor Can Approve Requests',
      hasPermission(supervisor, 'canApproveRequests'),
      'Supervisor should be able to approve requests'
    );

    this.addResult(
      'Doctor Cannot Approve Requests',
      !hasPermission(doctor, 'canApproveRequests'),
      'Doctor should not be able to approve requests'
    );

    this.addResult(
      'Nurse Cannot Approve Requests',
      !hasPermission(nurse, 'canApproveRequests'),
      'Nurse should not be able to approve requests'
    );
  }

  // Test staff management permissions
  testStaffManagementPermissions() {
    console.log('👥 Testing Staff Management Permissions...');

    Object.entries(this.testProfiles).forEach(([role, profile]) => {
      const canManage = hasPermission(profile, 'canManageStaff');
      const shouldManage = role === 'admin' || role === 'supervisor';

      this.addResult(
        `${role.charAt(0).toUpperCase() + role.slice(1)} Staff Management`,
        canManage === shouldManage,
        `${role} ${shouldManage ? 'should' : 'should not'} be able to manage staff`
      );
    });
  }

  // Test report access permissions
  testReportAccessPermissions() {
    console.log('📊 Testing Report Access Permissions...');

    Object.entries(this.testProfiles).forEach(([role, profile]) => {
      const canView = hasPermission(profile, 'canViewReports');
      const shouldView = role === 'admin' || role === 'supervisor';

      this.addResult(
        `${role.charAt(0).toUpperCase() + role.slice(1)} Report Access`,
        canView === shouldView,
        `${role} ${shouldView ? 'should' : 'should not'} be able to view reports`
      );
    });
  }

  // Test role hierarchy and inheritance
  testRoleHierarchy() {
    console.log('📊 Testing Role Hierarchy...');

    // Admin should have most permissions
    const adminPermCount = Object.values(this.testProfiles.admin.permissions).filter(Boolean).length;
    const supervisorPermCount = Object.values(this.testProfiles.supervisor.permissions).filter(Boolean).length;
    const doctorPermCount = Object.values(this.testProfiles.doctor.permissions).filter(Boolean).length;

    this.addResult(
      'Role Permission Hierarchy',
      adminPermCount >= supervisorPermCount && supervisorPermCount >= doctorPermCount,
      `Permission hierarchy should be Admin >= Supervisor >= Doctor/Nurse`
    );
  }

  // Test edge cases and error handling
  testEdgeCases() {
    console.log('🔍 Testing Edge Cases...');

    // Test with null/undefined profile
    this.addResult(
      'Null Profile Handling',
      !hasPermission(null as any, 'canManageStaff'),
      'Should return false for null profile'
    );

    // Test with undefined permissions
    const invalidProfile = { ...this.testProfiles.admin, permissions: undefined as any };
    this.addResult(
      'Undefined Permissions Handling',
      !hasPermission(invalidProfile, 'canManageStaff'),
      'Should return false for undefined permissions'
    );

    // Test role case sensitivity
    const mixedCaseRole = 'ADMIN' as UserRole;
    this.addResult(
      'Role Case Sensitivity',
      ROLE_PERMISSIONS[mixedCaseRole] === undefined,
      'Role lookup should be case sensitive'
    );
  }

  // Generate comprehensive test report
  generateReport() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const failedTests = this.results.filter(r => !r.passed);

    console.log('\n' + '='.repeat(60));
    console.log(`🧪 ROLE-BASED SYSTEM TEST REPORT`);
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${passed}/${total} (${Math.round(passed/total * 100)}%)`);
    
    if (failedTests.length > 0) {
      console.log(`❌ Failed: ${failedTests.length}`);
      console.log('\nFailed Tests:');
      failedTests.forEach(test => {
        console.log(`  • ${test.test}: ${test.message}`);
      });
    }

    console.log('\nDetailed Results:');
    this.results.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`  ${icon} ${result.test}: ${result.message}`);
    });

    console.log('\n' + '='.repeat(60));
    return { passed, total, success: passed === total };
  }

  // Run all tests
  runAllTests() {
    console.log('🚀 Starting Role-Based System Tests...\n');
    
    this.results = []; // Clear previous results
    
    this.testPermissionMappings();
    this.testPermissionChecking();
    this.testNavigationAccess();
    this.testRequestApprovalPermissions();
    this.testStaffManagementPermissions();
    this.testReportAccessPermissions();
    this.testRoleHierarchy();
    this.testEdgeCases();
    
    return this.generateReport();
  }

  // Get demo login instructions
  getDemoInstructions() {
    console.log('\n' + '📱 DEMO LOGIN INSTRUCTIONS');
    console.log('='.repeat(40));
    console.log('Use these credentials to test different roles:');
    console.log('');
    console.log('👨‍💼 ADMIN (Full Access):');
    console.log('  Email: admin@hospital.com');
    console.log('  Password: demo123');
    console.log('  Access: All features and navigation');
    console.log('');
    console.log('👨‍⚕️ SUPERVISOR (Management):');
    console.log('  Email: supervisor@hospital.com');
    console.log('  Password: demo123');
    console.log('  Access: Staff, scheduling, requests, reports');
    console.log('');
    console.log('🩺 DOCTOR (Limited):');
    console.log('  Email: doctor@hospital.com');
    console.log('  Password: demo123');
    console.log('  Access: Dashboard, requests, notifications');
    console.log('');
    console.log('👩‍⚕️ NURSE (Limited):');
    console.log('  Email: nurse@hospital.com');
    console.log('  Password: demo123');
    console.log('  Access: Dashboard, requests, notifications');
    console.log('');
    console.log('💡 Quick Demo Buttons available on login page!');
  }
}

// Export for browser console access
const testRoleBasedSystem = new RoleBasedSystemTester();

// Browser console interface
if (typeof window !== 'undefined') {
  (window as any).testRoleBasedSystem = {
    runAllTests: () => testRoleBasedSystem.runAllTests(),
    getDemoInstructions: () => testRoleBasedSystem.getDemoInstructions(),
    testPermissions: () => testRoleBasedSystem.testPermissionMappings(),
    testNavigation: () => testRoleBasedSystem.testNavigationAccess(),
    testApproval: () => testRoleBasedSystem.testRequestApprovalPermissions()
  };
}

export default testRoleBasedSystem;
