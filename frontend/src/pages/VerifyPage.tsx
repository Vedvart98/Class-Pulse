import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
        setMessage('Login successful!');
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Invalid or expired token');
      }
    };

    verify();
  }, [searchParams, navigate, login]);

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        {status === 'loading' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 24px' }}></div>
            <p className="text-muted text-center">Verifying your magic link...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="success-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-center">You're in!</h2>
            <p className="text-muted text-center">{message}</p>
            <p className="text-small text-muted text-center mt-2">Redirecting to dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ width: 64, height: 64, margin: '0 auto 16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 32, height: 32, color: '#EF4444' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-center">Verification Failed</h2>
            <p className="text-muted text-center mb-4">{message}</p>
            <a href="/login" className="btn btn-primary w-full">
              Back to Login
            </a>
          </>
        )}
      </div>
    </div>
  );
};