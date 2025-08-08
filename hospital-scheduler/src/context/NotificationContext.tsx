import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types';
import { useAuth } from './MockAuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { userProfile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (userProfile?.email) {
      const stored = localStorage.getItem(`notifications_${userProfile.email}`);
      if (stored) {
        const parsedNotifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsedNotifications);
      } else {
        // Add some sample notifications for demo
        addSampleNotifications();
      }
    }
  }, [userProfile?.email]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (userProfile?.email && notifications.length > 0) {
      localStorage.setItem(`notifications_${userProfile.email}`, JSON.stringify(notifications));
    }
  }, [notifications, userProfile?.email]);

  const addSampleNotifications = () => {
    if (!userProfile) return;

    const sampleNotifications: Omit<Notification, 'id' | 'timestamp' | 'isRead'>[] = [];

    if (userProfile.role === 'doctor' || userProfile.role === 'nurse') {
      sampleNotifications.push(
        {
          type: 'shift_change',
          title: 'Shift Update',
          message: 'Your Thursday shift has been moved from 8:00 AM to 9:00 AM',
          userId: userProfile.email,
          priority: 'medium',
          actionUrl: '/my-schedule'
        },
        {
          type: 'request_approved',
          title: 'Request Approved',
          message: 'Your time-off request for Dec 25-26 has been approved',
          userId: userProfile.email,
          priority: 'low',
          actionUrl: '/my-requests'
        },
        {
          type: 'coverage_needed',
          title: 'Coverage Needed',
          message: 'Emergency coverage needed in ICU for tonight 11 PM - 7 AM',
          userId: userProfile.email,
          priority: 'high',
          actionUrl: '/my-schedule'
        }
      );
    }

    if (userProfile.role === 'supervisor' || userProfile.role === 'admin') {
      sampleNotifications.push(
        {
          type: 'new_request',
          title: 'New Time-Off Request',
          message: 'Dr. Sarah Johnson has requested time off for Jan 15-17',
          userId: userProfile.email,
          priority: 'medium',
          actionUrl: '/requests-management'
        },
        {
          type: 'system_alert',
          title: 'Staffing Alert',
          message: 'Emergency department is understaffed for weekend shifts',
          userId: userProfile.email,
          priority: 'high',
          actionUrl: '/staff-management'
        }
      );
    }

    sampleNotifications.forEach(notification => {
      addNotification(notification);
    });
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep only latest 50
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
