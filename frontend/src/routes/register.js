import { useState } from "react";
import "./register.css";
import { useAuth } from "../contexts/useAuth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register_user } = useAuth();
  const nav = useNavigate();

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Form validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      const success = await register_user(username, email, password);
      
      if (success) {
        nav("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join us today</p>
        </div>
        
        <form onSubmit={handleRegister} className="register-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <button 
            type="submit"
            className={`register-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div> 
      </div>
    </div>
  );
};

export default Register;