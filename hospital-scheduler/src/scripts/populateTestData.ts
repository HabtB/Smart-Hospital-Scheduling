import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const testStaff = [
  {
    id: 'staff1',
    name: 'Dr. John Smith',
    role: 'doctor',
    department: 'Emergency',
    departmentId: 'dept1',
    email: 'john.smith@hospital.com',
    phone: '(555) 123-4567',
    isActive: true,
    specialization: 'Emergency Medicine',
    licenseNumber: 'MD12345',
    hireDate: new Date('2020-01-15'),
    shift: 'day'
  },
  {
    id: 'staff2',
    name: 'Nurse Maria Garcia',
    role: 'nurse',
    department: 'ICU',
    departmentId: 'dept2',
    email: 'maria.garcia@hospital.com',
    phone: '(555) 234-5678',
    isActive: true,
    specialization: 'Critical Care',
    licenseNumber: 'RN67890',
    hireDate: new Date('2019-03-10'),
    shift: 'night'
  },
  {
    id: 'staff3',
    name: 'Dr. Emily Chen',
    role: 'doctor',
    department: 'Cardiology',
    departmentId: 'dept3',
    email: 'emily.chen@hospital.com',
    phone: '(555) 345-6789',
    isActive: true,
    specialization: 'Cardiology',
    licenseNumber: 'MD23456',
    hireDate: new Date('2018-07-22'),
    shift: 'day'
  },
  {
    id: 'staff4',
    name: 'Nurse Robert Johnson',
    role: 'nurse',
    department: 'Pediatrics',
    departmentId: 'dept4',
    email: 'robert.johnson@hospital.com',
    phone: '(555) 456-7890',
    isActive: true,
    specialization: 'Pediatric Care',
    licenseNumber: 'RN78901',
    hireDate: new Date('2021-02-14'),
    shift: 'day'
  },
  {
    id: 'staff5',
    name: 'Dr. Sarah Wilson',
    role: 'supervisor',
    department: 'Administration',
    departmentId: 'dept5',
    email: 'sarah.wilson@hospital.com',
    phone: '(555) 567-8901',
    isActive: true,
    specialization: 'Hospital Administration',
    licenseNumber: 'ADM34567',
    hireDate: new Date('2017-11-08'),
    shift: 'day'
  }
];

const testDepartments = [
  {
    id: 'dept1',
    name: 'Emergency',
    description: 'Emergency Department'
  },
  {
    id: 'dept2',
    name: 'ICU',
    description: 'Intensive Care Unit'
  },
  {
    id: 'dept3',
    name: 'Cardiology',
    description: 'Cardiology Department'
  },
  {
    id: 'dept4',
    name: 'Pediatrics',
    description: 'Pediatrics Department'
  },
  {
    id: 'dept5',
    name: 'Administration',
    description: 'Hospital Administration'
  }
];

export async function populateTestData() {
  try {
    console.log('🔄 Populating test data...');
    
    // Add departments
    for (const dept of testDepartments) {
      await setDoc(doc(db, 'departments', dept.id), dept);
      console.log(`✅ Added department: ${dept.name}`);
    }
    
    // Add staff members
    for (const staff of testStaff) {
      await setDoc(doc(db, 'staff', staff.id), staff);
      console.log(`✅ Added staff member: ${staff.name}`);
    }
    
    console.log('🎉 Test data populated successfully!');
    
  } catch (error) {
    console.error('❌ Error populating test data:', error);
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateTestData();
}
