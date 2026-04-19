import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { announcementApi, userApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export const AdminPage: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'announcements' | 'students'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'MEDIUM' });
  const [studentForm, setStudentForm] = useState({ name: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'announcements') {
      fetchAnnouncements();
    } else {
      fetchStudents();
    }
  }, [activeTab]);

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

  const fetchStudents = async () => {
    try {
      const response = await userApi.getAll();
      setStudents(response.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    } finally {
      setFetching(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await userApi.create(studentForm);
      setStudentForm({ name: '', email: '' });
      setShowForm(false);
      fetchStudents();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create student');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await userApi.delete(id);
      fetchStudents();
    } catch (err) {
      console.error('Failed to delete student', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editingId) {
        await announcementApi.update(editingId, formData);
      } else {
        await announcementApi.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ title: '', content: '', priority: 'MEDIUM' });
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await announcementApi.delete(id);
      fetchAnnouncements();
    } catch (err) {
      console.error('Failed to delete announcement', err);
    }
  };

  if (loading) {
    return <div className="app-container"><div className="spinner"></div></div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="app-container">
      <Header />
      <div className="fade-in">
        <div className="flex flex-between mb-4">
          <h1>Admin Panel</h1>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
          <button
            className={`tab ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {activeTab === 'announcements' && (
          <>
            <div className="flex flex-between mb-4">
              <button 
                onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ title: '', content: '', priority: 'MEDIUM' }); }}
                className="btn btn-primary"
              >
                {showForm ? 'Cancel' : '+ New Announcement'}
              </button>
            </div>

            {showForm && (
              <div className="card mb-4 fade-in">
                <h2>{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Content</label>
                    <textarea
                      className="input textarea"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      className="select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={() => { setShowForm(false); setEditingId(null); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {fetching && <div className="spinner"></div>}

            {!fetching && announcements.map((announcement) => (
              <div key={announcement.id} className="card" style={{ 
                borderLeft: announcement.priority === 'HIGH' ? '3px solid #EF4444' : 
                       announcement.priority === 'MEDIUM' ? '3px solid #F59E0B' : '3px solid #10B981'
              }}>
                <div className="flex flex-between mb-2">
                  <h3 style={{ margin: 0, flex: 1 }}>{announcement.title}</h3>
                  <span className={`priority-badge priority-${announcement.priority.toLowerCase()}`}>
                    {announcement.priority}
                  </span>
                </div>
                <p className="text-muted mb-4" style={{ whiteSpace: 'pre-wrap' }}>{announcement.content}</p>
                <div className="flex flex-between">
                  <span className="text-small text-muted">
                    By {announcement.createdByName} • {new Date(announcement.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(announcement)} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: 13 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(announcement.id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13 }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {activeTab === 'students' && (
          <>
            <div className="flex flex-between mb-4">
              <button 
                onClick={() => { setShowForm(!showForm); setStudentForm({ name: '', email: '' }); }}
                className="btn btn-primary"
              >
                {showForm ? 'Cancel' : '+ Add Student'}
              </button>
            </div>

            {showForm && (
              <div className="card mb-4 fade-in">
                <h2>New Student</h2>
                <form onSubmit={handleStudentSubmit}>
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      className="input"
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="input"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Creating...' : 'Create'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      onClick={() => { setShowForm(false); }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {fetching && <div className="spinner"></div>}

            {!fetching && (
              <div className="card">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>
                          <span className={`priority-badge priority-${student.role === 'ADMIN' ? 'high' : 'low'}`}>
                            {student.role}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => handleDeleteStudent(student.id)} 
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: 13 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};