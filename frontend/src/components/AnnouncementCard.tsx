import React, { useState } from 'react';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const [expanded, setExpanded] = useState(false);

  const priorityClass = `priority-${announcement.priority.toLowerCase()}`;
  const date = new Date(announcement.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const contentPreview = announcement.content.length > 150 
    ? announcement.content.substring(0, 150) + '...'
    : announcement.content;

  return (
    <div className="card">
      <div className="flex flex-between mb-4">
        <h3 style={{ margin: 0 }}>{announcement.title}</h3>
        <span className={`priority-badge ${priorityClass}`}>{announcement.priority}</span>
      </div>
      <p className="text-muted mb-4">
        {expanded ? announcement.content : contentPreview}
      </p>
      <div className="flex flex-between">
        <span className="text-small text-muted">
          By {announcement.createdByName} • {date}
        </span>
        {announcement.content.length > 150 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="btn btn-outline"
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};