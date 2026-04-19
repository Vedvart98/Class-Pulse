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

  const contentPreview = announcement.content.length > 180 
    ? announcement.content.substring(0, 180) + '...'
    : announcement.content;

  return (
    <div 
      className="card" 
      style={{ 
        cursor: 'pointer',
        borderLeft: announcement.priority === 'HIGH' ? '3px solid #EF4444' : 
               announcement.priority === 'MEDIUM' ? '3px solid #F59E0B' : '3px solid #10B981'
      }}
      onClick={() => announcement.content.length > 180 && setExpanded(!expanded)}
    >
      <div className="flex flex-between mb-2">
        <h3 style={{ margin: 0, flex: 1 }}>{announcement.title}</h3>
        <span className={`priority-badge ${priorityClass}`}>{announcement.priority}</span>
      </div>
      <p className="text-muted mb-2" style={{ lineHeight: 1.7 }}>
        {expanded ? announcement.content : contentPreview}
      </p>
      <div className="flex flex-between" style={{ marginTop: 8 }}>
        <span className="text-small text-muted">
          <svg 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            style={{ width: 14, height: 14, display: 'inline', marginRight: 4, verticalAlign: 'middle' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {announcement.createdByName}
          <span style={{ margin: '0 8px', opacity: 0.5 }}>•</span>
          <svg 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            style={{ width: 14, height: 14, display: 'inline', marginRight: 4, verticalAlign: 'middle' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {date}
        </span>
        {announcement.content.length > 180 && (
          <button 
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="btn btn-ghost"
            style={{ padding: '4px 12px', fontSize: 13 }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </div>
  );
};