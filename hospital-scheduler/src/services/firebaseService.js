import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Staff Management
export const staffService = {
  // Create new staff member
  async createStaff(staffData) {
    try {
      const docRef = await addDoc(collection(db, 'staff'), {
        ...staffData,
        createdAt: serverTimestamp(),
        isActive: true
      });
      
      // Log activity
      await this.logActivity('staff_created', `New staff member added: ${staffData.name}`);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  // Update staff member
  async updateStaff(staffId, updates) {
    try {
      await updateDoc(doc(db, 'staff', staffId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      await this.logActivity('staff_updated', `Staff member updated: ${staffId}`);
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  // Deactivate staff member (soft delete)
  async deactivateStaff(staffId) {
    try {
      await updateDoc(doc(db, 'staff', staffId), {
        isActive: false,
        deactivatedAt: serverTimestamp()
      });
      
      await this.logActivity('staff_deactivated', `Staff member deactivated: ${staffId}`);
    } catch (error) {
      console.error('Error deactivating staff:', error);
      throw error;
    }
  },

  // Log activity for audit trail
  async logActivity(type, description, metadata = {}) {
    try {
      await addDoc(collection(db, 'activity'), {
        type,
        description,
        metadata,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }
};

// Shift Management
export const shiftService = {
  // Create new shift
  async createShift(shiftData) {
    try {
      // Validate shift doesn't conflict
      const conflicts = await this.checkShiftConflicts(shiftData);
      if (conflicts.length > 0) {
        throw new Error(`Shift conflicts detected: ${conflicts.join(', ')}`);
      }

      const docRef = await addDoc(collection(db, 'shifts'), {
        ...shiftData,
        status: 'open',
        createdAt: serverTimestamp()
      });

      await staffService.logActivity(
        'shift_created', 
        `New shift created: ${shiftData.startTime} - ${shiftData.endTime}`
      );

      return docRef.id;
    } catch (error) {
      console.error('Error creating shift:', error);
      throw error;
    }
  },

  // Assign staff to shift
  async assignShift(shiftId, staffId) {
    try {
      // Validate assignment
      const validation = await this.validateShiftAssignment(shiftId, staffId);
      if (!validation.isValid) {
        throw new Error(`Assignment invalid: ${validation.reasons.join(', ')}`);
      }

      await updateDoc(doc(db, 'shifts', shiftId), {
        assignedStaffId: staffId,
        status: 'filled',
        assignedAt: serverTimestamp()
      });

      await staffService.logActivity(
        'shift_assigned',
        `Staff ${staffId} assigned to shift ${shiftId}`
      );
    } catch (error) {
      console.error('Error assigning shift:', error);
      throw error;
    }
  },

  // Check for shift conflicts
  async checkShiftConflicts(shiftData) {
    const conflicts = [];
    
    try {
      // Check if staff already has a shift at this time
      if (shiftData.assignedStaffId) {
        const q = query(
          collection(db, 'shifts'),
          where('assignedStaffId', '==', shiftData.assignedStaffId),
          where('startTime', '<=', shiftData.endTime),
          where('endTime', '>=', shiftData.startTime)
        );
        
        const conflictingShifts = await getDocs(q);
        if (!conflictingShifts.empty) {
          conflicts.push('Staff already assigned to overlapping shift');
        }
      }
    } catch (error) {
      console.error('Error checking conflicts:', error);
    }

    return conflicts;
  },

  // Validate shift assignment
  async validateShiftAssignment(shiftId, staffId) {
    const reasons = [];
    
    try {
      // Get shift and staff data
      const [shiftDoc, staffDoc] = await Promise.all([
        getDoc(doc(db, 'shifts', shiftId)),
        getDoc(doc(db, 'staff', staffId))
      ]);

      if (!shiftDoc.exists() || !staffDoc.exists()) {
        reasons.push('Shift or staff not found');
        return { isValid: false, reasons };
      }

      const shift = shiftDoc.data();
      const staff = staffDoc.data();

      // Check department match
      if (shift.departmentId !== staff.departmentId) {
        reasons.push('Department mismatch');
      }

      // Check certifications
      if (shift.requiredCertifications) {
        const hasRequired = shift.requiredCertifications.every(cert => 
          staff.certifications?.includes(cert)
        );
        if (!hasRequired) {
          reasons.push('Missing required certifications');
        }
      }

      // Check role match
      if (shift.requiredRole && shift.requiredRole !== staff.role) {
        reasons.push('Role mismatch');
      }

      // TODO: Check weekly hours limit
      // TODO: Check rest periods between shifts

    } catch (error) {
      console.error('Error validating assignment:', error);
      reasons.push('Validation error');
    }

    return { isValid: reasons.length === 0, reasons };
  }
};
