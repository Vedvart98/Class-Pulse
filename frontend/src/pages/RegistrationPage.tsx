import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';
import { Header } from '../components/Header';

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
      <div className="app-container">
        <Header />
        <div className="card" style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
          <div style={{ padding: '16px', background: '#F0FDF4', borderRadius: '8px' }}>
            <p style={{ fontWeight: 500, marginBottom: '8px', color: '#166534', fontSize: '18px' }}>
              ✓ Registration Successful!
            </p>
            <p className="text-muted">
              Your account has been created. Go to login to receive a magic link.
            </p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Create Account</h2>
        
        <p className="text-muted" style={{ textAlign: 'center', marginBottom: '24px' }}>
          Register to receive announcements via email magic link
        </p>

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
            />
          </div>
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
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-small text-muted" style={{ textAlign: 'center', marginTop: '16px' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};