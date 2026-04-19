import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';

export const RegistrationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await userApi.register({ name, email });
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('Email already registered');
      } else {
        setError(err.response?.data?.message || 'Failed to register');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card fade-in">
          <div className="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-center">Account Created!</h2>
          <p className="text-muted text-center mb-4">
            Your account for <strong>{email}</strong> has been created.
          </p>
          <p className="text-small text-muted text-center">
            Go to login to receive your magic link.
          </p>
          <Link to="/login" className="btn btn-primary w-full mt-4">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <h2 className="auth-logo">ClassAnnounce</h2>
        <p className="auth-subtitle">Create your account to get started.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              disabled={loading}
            />
          </div>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-small text-muted text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};