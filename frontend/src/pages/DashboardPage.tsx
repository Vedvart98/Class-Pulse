import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { announcementApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { AnnouncementCard } from '../components/AnnouncementCard';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementApi.getAll();
        setAnnouncements(response.data);
      } catch (err) {
        console.error('Failed to fetch announcements', err);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchAnnouncements();
    }
  }, [user]);

  if (loading || !user) {
    return <div className="app-container"><div className="spinner"></div></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Header showAdminLink />
      <div className="fade-in">
        <div className="flex flex-between mb-4" style={{ alignItems: 'baseline' }}>
          <div>
            <h1>Welcome, {user.name.split(' ')[0]}!</h1>
            <p className="text-muted">Here are the latest announcements for your class:</p>
          </div>
        </div>

        {fetching && <div className="spinner"></div>}

        {!fetching && announcements.length === 0 && (
          <div className="card empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 64, height: 64, margin: '0 auto 16px', opacity: 0.3 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-muted">No announcements yet.</p>
          </div>
        )}

        {!fetching && announcements.map((announcement, index) => (
          <div key={announcement.id} style={{ animationDelay: `${index * 0.05}s` }} className="fade-in">
            <AnnouncementCard announcement={announcement} />
          </div>
        ))}
      </div>
    </div>
  );
};