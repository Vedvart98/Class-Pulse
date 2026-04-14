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
            <span className="text-muted">{user.name}</span>
            {showAdminLink && user.role === 'ADMIN' && (
              <a href="/admin" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
                Admin Panel
              </a>
            )}
            <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};