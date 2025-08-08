import React, { useEffect, useState } from 'react';
import { 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaCalendarAlt,
  FaBell
} from 'react-icons/fa';
import { Notification } from '../types';

interface ToastNotificationProps {
  notification: Notification;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  notification,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getToastStyles = () => {
    const baseStyles = "transform transition-all duration-300 ease-in-out";
    
    if (isExiting) {
      return `${baseStyles} translate-x-full opacity-0`;
    }
    
    if (isVisible) {
      return `${baseStyles} translate-x-0 opacity-100`;
    }
    
    return `${baseStyles} translate-x-full opacity-0`;
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'shift_change':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'request_approved':
        return <FaCheck className="text-green-500" />;
      case 'request_rejected':
        return <FaTimes className="text-red-500" />;
      case 'new_request':
        return <FaInfoCircle className="text-blue-500" />;
      case 'coverage_needed':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'schedule_update':
        return <FaCalendarAlt className="text-purple-500" />;
      case 'system_alert':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getPriorityStyles = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'high':
        return 'border-l-4 border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-4 border-gray-500 bg-gray-50';
      default:
        return 'border-l-4 border-gray-500 bg-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 w-96 ${getToastStyles()}`}>
      <div className={`bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden ${getPriorityStyles()}`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getNotificationIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </h4>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              {notification.actionUrl && (
                <button
                  onClick={() => {
                    // In a real app, navigate to the URL
                    console.log('Navigate to:', notification.actionUrl);
                    handleClose();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
                >
                  View Details →
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress bar for auto-close */}
        {autoClose && (
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-blue-500 transition-all ease-linear"
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default ToastNotification;
