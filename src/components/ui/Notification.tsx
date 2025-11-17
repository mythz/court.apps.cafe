import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
  duration = 3000
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-600 border-green-400',
    error: 'bg-red-600 border-red-400',
    info: 'bg-blue-600 border-blue-400',
    warning: 'bg-yellow-600 border-yellow-400'
  };

  const icons = {
    success: '✓',
    error: '✗',
    info: 'ℹ',
    warning: '⚠'
  };

  return (
    <div
      className={`notification fixed top-20 right-4 z-50 p-4 rounded-lg border-2 shadow-lg min-w-64 max-w-md transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      } ${typeStyles[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icons[type]}</span>
        <p className="flex-1 text-white font-semibold">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white hover:text-gray-200 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Notification Manager Component
interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const NotificationContainer: React.FC<{ notifications: NotificationItem[] }> = ({ notifications }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div key={notification.id} style={{ top: `${80 + index * 80}px` }}>
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => {}}
          />
        </div>
      ))}
    </div>
  );
};
