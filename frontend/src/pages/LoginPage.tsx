import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.requestMagicLink(email);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send magic link');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkClick = async (token: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await authApi.verifyToken(token);
      login(response.data.token, {
        id: response.data.userId,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      handleMagicLinkClick(token);
    }
  }, []);

  return (
    <div className="app-container">
      <Header />
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Welcome to ClassAnnounce</h2>
        
        {sent ? (
          <div style={{ padding: '16px', background: '#F0FDF4', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ fontWeight: 500, marginBottom: '8px', color: '#166534' }}>
              ✓ Magic link sent!
            </p>
            <p className="text-small text-muted">
              Check your email for the login link. In development mode, the link is logged to console.
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px' }}>
              Enter your email to receive a magic link for passwordless login
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </form>

            <p className="text-small text-muted" style={{ textAlign: 'center', marginTop: '16px' }}>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};