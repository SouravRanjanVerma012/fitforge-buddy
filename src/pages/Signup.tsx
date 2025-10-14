import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting registration with email:', email);
      
      // Use the auth context register function
      await register(name, email, password);
      
      // Redirect to home page after successful registration
      navigate("/");
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'hsl(0, 0%, 96%)', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '40px', alignItems: 'center', minHeight: 'calc(100vh - 40px)' }}>
          {/* Left Column - Welcome Section */}
          <div style={{ flex: 1, textAlign: 'center', padding: '20px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' }}>
              Join <br />
              <span style={{ color: '#fd7e14' }}>FitForge Buddy</span>
            </h1>
            <p style={{ color: 'hsl(217, 10%, 50.8%)', fontSize: '1.1rem', lineHeight: '1.6' }}>
              Start your fitness journey today! Create your account and unlock access to personalized workout plans, progress tracking, and a supportive community dedicated to helping you achieve your health and fitness goals.
            </p>
          </div>

          {/* Right Column - Sign Up Form */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '10px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              padding: '40px', 
              width: '100%', 
              maxWidth: '400px' 
            }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>Sign Up</h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Your Name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px'
                    }}
                  />
                </div>

                {error && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '14px', 
                    textAlign: 'center', 
                    padding: '10px', 
                    backgroundColor: '#f8d7da', 
                    borderRadius: '5px', 
                    marginBottom: '20px' 
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#fd7e14',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    marginBottom: '20px'
                  }}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </button>
              </form>

              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#666' }}>
                  Already have an account? <a href="/login" style={{ color: '#fd7e14', textDecoration: 'none' }}>Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 