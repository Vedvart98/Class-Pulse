import React from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  showAdminLink?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ showAdminLink }) => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-title">ClassAnnounce</div>
      <div className="header-user">
        {user && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div 
                style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  color: 'white'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-muted">{user.name}</span>
            </div>
            {showAdminLink && user.role === 'ADMIN' && (
              <a href="/admin" className="btn btn-ghost">
                Admin
              </a>
            )}
            <button onClick={logout} className="btn btn-ghost">
              Sign Out
            </button>
          </>
        )}
      </div>
    </header>
  );
};