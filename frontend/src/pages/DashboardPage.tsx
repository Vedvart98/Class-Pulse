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
    return <div className="spinner"></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Header showAdminLink />
      <h1>Welcome, {user.name}!</h1>
      <p className="text-muted mb-4">Here are the latest announcements for your class:</p>

      {fetching && <div className="spinner"></div>}

      {!fetching && announcements.length === 0 && (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="text-muted">No announcements yet.</p>
        </div>
      )}

      {!fetching && announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
};