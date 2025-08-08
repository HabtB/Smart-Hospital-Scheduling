import React, { useState, useCallback } from 'react';
import ToastNotification from './ToastNotification';
import { Notification } from '../types';

interface ToastManagerProps {
  children: React.ReactNode;
}

interface ActiveToast extends Notification {
  toastId: string;
}

// Global toast manager instance
let globalToastManager: {
  showToast: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
} | null = null;

const ToastManager: React.FC<ToastManagerProps> = ({ children }) => {
  const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);

  const showToast = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const toastId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const fullNotification: ActiveToast = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false,
      toastId
    };

    setActiveToasts(prev => [...prev, fullNotification]);

    // Auto-remove after 6 seconds if not manually closed
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(toast => toast.toastId !== toastId));
    }, 6000);
  }, []);

  const removeToast = useCallback((toastId: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.toastId !== toastId));
  }, []);

  // Set global reference
  React.useEffect(() => {
    globalToastManager = { showToast };
    return () => {
      globalToastManager = null;
    };
  }, [showToast]);

  return (
    <>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[60] space-y-2">
        {activeToasts.map((toast, index) => (
          <div
            key={toast.toastId}
            style={{ 
              transform: `translateY(${index * 8}px)`,
              zIndex: 60 - index 
            }}
          >
            <ToastNotification
              notification={toast}
              onClose={() => removeToast(toast.toastId)}
              autoClose={true}
              duration={5000}
            />
          </div>
        ))}
      </div>
    </>
  );
};

// Global function to trigger toasts from anywhere in the app
export const showToast = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
  if (globalToastManager) {
    globalToastManager.showToast(notification);
  } else {
    console.warn('ToastManager not initialized. Make sure ToastManager wraps your app.');
  }
};

export default ToastManager;
