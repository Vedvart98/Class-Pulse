import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
    <div className="auth-page">
      <div className="auth-card fade-in">
        {sent ? (
          <>
            <div className="success-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-center">Magic Link Sent!</h2>
            <p className="text-muted text-center mb-4">
              We've sent a login link to <strong>{email}</strong>
            </p>
            <p className="text-small text-muted text-center">
              Check your email and click the link to sign in. The link expires in 15 minutes.
            </p>
          </>
        ) : (
          <>
            <h2 className="auth-logo">ClassAnnounce</h2>
            <p className="auth-subtitle">Welcome back! Enter your email to sign in.</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-full" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex-center gap-2">
                    <span className="spinner" style={{ padding: 0, width: 20, height: 20 }}></span>
                    Sending...
                  </span>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>

            <p className="text-small text-muted text-center mt-4">
              Don't have an account?{' '}
              <Link to="/register" className="link">Register here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};