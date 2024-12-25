import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/images/1.png';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const userData = JSON.parse(rememberedUser);
      setFormData(prev => ({
        ...prev,
        email: userData.email,
        password: userData.password
      }));
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === formData.email)) {
          alert('User already exists!');
          return;
        }
        
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match!");
          return;
        }

        users.push({
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('users', JSON.stringify(users));
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (!user) {
          alert('Invalid credentials!');
          return;
        }
      }

      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({
          email: formData.email,
          password: formData.password
        }));
      } else {
        localStorage.removeItem('rememberedUser');
      }

      await login({ email: formData.email });
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-section">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <p className="motto">Join the conversation</p>
          </div>
        </div>
        <div className="form-section">
          <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            {isSignUp && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
              />
            )}
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <button type="submit">
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              className="switch-button"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
