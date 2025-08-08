import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { showToast } from '../components/ToastManager';
import { Notification } from '../types';

// Event-driven notification triggers
export class NotificationService {
  private static addNotification: ((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void) | null = null;

  // Initialize with notification context
  static initialize(addNotificationFn: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void) {
    this.addNotification = addNotificationFn;
  }

  // Helper to create and show notification
  private static createNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>, showToastPopup = true) {
    // Add to notification center
    if (this.addNotification) {
      this.addNotification(notification);
    }

    // Show toast popup for real-time alert
    if (showToastPopup) {
      showToast(notification);
    }
  }

  // Employee/User Management Events
  static onEmployeeCreated(employeeName: string, role: string, createdBy: string) {
    // Notify admins/supervisors about new employee
    this.createNotification({
      type: 'system_alert',
      title: 'New Employee Added',
      message: `${employeeName} (${role}) has been added to the system by ${createdBy}`,
      userId: 'admin@hospital.com', // Could be dynamic based on who should be notified
      priority: 'medium',
      actionUrl: '/staff-management'
    });
  }

  static onStaffMemberAdded(staffName: string, department: string, createdBy: string) {
    // Notify relevant supervisors about new staff member
    this.createNotification({
      type: 'system_alert',
      title: 'New Staff Member',
      message: `${staffName} has been added to ${department} department by ${createdBy}`,
      userId: 'supervisor@hospital.com',
      priority: 'low',
      actionUrl: '/staff-management'
    });
  }

  // Request Management Events
  static onTimeOffRequestSubmitted(requestorName: string, requestorEmail: string, dates: string) {
    // Notify supervisors/admins about new request
    this.createNotification({
      type: 'new_request',
      title: 'New Time-Off Request',
      message: `${requestorName} has requested time off for ${dates}`,
      userId: 'supervisor@hospital.com',
      priority: 'medium',
      actionUrl: '/requests-management',
      metadata: {
        requestId: Date.now().toString()
      }
    });
  }

  static onRequestApproved(requestorEmail: string, requestType: string, dates: string, approvedBy: string) {
    // Notify the requestor about approval
    this.createNotification({
      type: 'request_approved',
      title: 'Request Approved',
      message: `Your ${requestType} request for ${dates} has been approved by ${approvedBy}`,
      userId: requestorEmail,
      priority: 'medium',
      actionUrl: '/my-requests'
    });
  }

  static onRequestRejected(requestorEmail: string, requestType: string, dates: string, rejectedBy: string, reason?: string) {
    // Notify the requestor about rejection
    this.createNotification({
      type: 'request_rejected',
      title: 'Request Rejected',
      message: `Your ${requestType} request for ${dates} has been rejected by ${rejectedBy}${reason ? `. Reason: ${reason}` : ''}`,
      userId: requestorEmail,
      priority: 'high',
      actionUrl: '/my-requests'
    });
  }

  // Shift Management Events
  static onShiftChanged(affectedUserEmail: string, oldShift: string, newShift: string, changedBy: string) {
    // Notify affected user about shift change
    this.createNotification({
      type: 'shift_change',
      title: 'Shift Update',
      message: `Your shift has been changed from ${oldShift} to ${newShift} by ${changedBy}`,
      userId: affectedUserEmail,
      priority: 'high',
      actionUrl: '/my-schedule',
      metadata: {
        shiftId: Date.now().toString()
      }
    });
  }

  static onCoverageNeeded(department: string, shift: string, urgency: 'low' | 'medium' | 'high' | 'urgent' = 'high') {
    // Notify relevant staff about coverage needs
    this.createNotification({
      type: 'coverage_needed',
      title: 'Coverage Needed',
      message: `${urgency === 'urgent' ? 'URGENT: ' : ''}Coverage needed in ${department} for ${shift}`,
      userId: 'doctor@hospital.com', // Could be dynamic based on department
      priority: urgency,
      actionUrl: '/my-schedule',
      metadata: {
        departmentId: department
      }
    });
  }

  static onScheduleUpdated(affectedUserEmail: string, updateType: string, details: string) {
    // Notify user about schedule updates
    this.createNotification({
      type: 'schedule_update',
      title: 'Schedule Updated',
      message: `${updateType}: ${details}`,
      userId: affectedUserEmail,
      priority: 'medium',
      actionUrl: '/my-schedule'
    });
  }

  // System Events
  static onSystemAlert(title: string, message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium', targetUsers: string[] = ['admin@hospital.com']) {
    // Send system alerts to specified users
    targetUsers.forEach(userEmail => {
      this.createNotification({
        type: 'system_alert',
        title,
        message,
        userId: userEmail,
        priority,
        actionUrl: '/dashboard'
      });
    });
  }

  // Demo/Test function to trigger sample notifications
  static triggerDemoNotifications() {
    // Simulate various events for testing
    setTimeout(() => {
      this.onEmployeeCreated('Dr. Sarah Wilson', 'Doctor', 'Admin User');
    }, 2000);

    setTimeout(() => {
      this.onTimeOffRequestSubmitted('Dr. John Smith', 'doctor@hospital.com', 'Dec 25-26, 2024');
    }, 4000);

    setTimeout(() => {
      this.onShiftChanged('nurse@hospital.com', 'Morning (8AM-4PM)', 'Evening (4PM-12AM)', 'Supervisor');
    }, 6000);

    setTimeout(() => {
      this.onCoverageNeeded('Emergency', 'Night shift (11PM-7AM)', 'urgent');
    }, 8000);

    setTimeout(() => {
      this.onRequestApproved('doctor@hospital.com', 'time-off', 'Jan 15-17, 2025', 'Supervisor');
    }, 10000);
  }
}

// Hook to initialize the service with notification context
export const useNotificationService = () => {
  const { addNotification } = useNotifications();

  React.useEffect(() => {
    NotificationService.initialize(addNotification);
  }, [addNotification]);

  return NotificationService;
};

// Export individual trigger functions for easy importing
export const {
  onEmployeeCreated,
  onStaffMemberAdded,
  onTimeOffRequestSubmitted,
  onRequestApproved,
  onRequestRejected,
  onShiftChanged,
  onCoverageNeeded,
  onScheduleUpdated,
  onSystemAlert,
  triggerDemoNotifications
} = NotificationService;
