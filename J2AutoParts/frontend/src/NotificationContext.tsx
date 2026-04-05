import React, { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { useAuth } from './AuthContext';

interface Notification {
  type: string;
  message: string;
  orderId?: number;
  timestamp: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  dismissNotification: (index: number) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  dismissNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return; // Chỉ kết nối nếu đã đăng nhập

    // Sử dụng đường dẫn tương đối để tương thích tự động với domain hiện tại
    const socketUrl = 'http://localhost:8080/ws'; 

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      // 1. Nếu là Admin, theo dõi thông báo global cho Admin
      if (isAdmin) {
        stompClient.subscribe('/topic/admin/notifications', (message) => {
          if (message.body) {
            const notif = JSON.parse(message.body) as Notification;
            setNotifications((prev) => [notif, ...prev]);
            
            // Tự động ẩn sau 5 giây
            setTimeout(() => {
              setNotifications((prev) => prev.filter(n => n !== notif));
            }, 5000);
          }
        });
      }

      // 2. Theo dõi thông báo riêng cho User (vd: Cập nhật trạng thái)
      stompClient.subscribe(`/topic/user/notifications/${user.id}`, (message) => {
        if (message.body) {
          const notif = JSON.parse(message.body) as Notification;
          setNotifications((prev) => [notif, ...prev]);
          
          // Tự động ẩn sau 5 giây
          setTimeout(() => {
             setNotifications((prev) => prev.filter(n => n !== notif));
          }, 5000);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Lỗi khi kết nối Stomp:', frame.headers['message']);
      console.error('Chi tiết:', frame.body);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [user, isAdmin]);

  const dismissNotification = (index: number) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <NotificationContext.Provider value={{ notifications, dismissNotification }}>
      {children}
      {/* Khối hiển thị Toast Notification */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {notifications.map((n, i) => (
          <div key={i} style={{
            background: n.type === 'NEW_ORDER' ? 'rgba(34,197,94,0.9)' : 'rgba(0,222,255,0.9)',
            color: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'slideIn 0.3s ease-out forwards',
            borderLeft: `4px solid ${n.type === 'NEW_ORDER' ? '#16a34a' : '#00b8d4'}`,
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', marginBottom: '4px', fontSize: '1.1rem' }}>
                {n.type === 'NEW_ORDER' ? 'Tin Báo Mới' : 'Cập Nhật Đơn Hàng'}
              </strong>
              <span style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>{n.message}</span>
            </div>
            <button onClick={() => dismissNotification(i)} style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
              opacity: 0.8
            }}>
              &times;
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
