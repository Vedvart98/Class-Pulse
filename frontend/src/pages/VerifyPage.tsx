import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No token provided');
      return;
    }

    const verify = async () => {
      try {
        const response = await authApi.verifyToken(token);
        login(response.data.token, {
          id: response.data.userId,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role,
        });
        setStatus('success');
        setMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Invalid or expired token');
      }
    };

    verify();
  }, [searchParams, navigate, login]);

  return (
    <div className="app-container">
      <Header />
      <div className="card" style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p>Verifying your magic link...</p>
          </>
        )}
        {status === 'success' && (
          <div className="alert alert-success">{message}</div>
        )}
        {status === 'error' && (
          <>
            <div className="alert alert-error">{message}</div>
            <a href="/login" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Back to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
};