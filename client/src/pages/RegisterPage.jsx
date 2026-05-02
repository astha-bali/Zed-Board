import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, UserCircle, ArrowRight, KanbanSquare, Shield } from 'lucide-react';
import { AuthIllustration } from '../components/common/Illustrations';

export default function RegisterPage({ defaultRole = 'member' }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, defaultRole, organization, designation, department);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-illustration">
        <AuthIllustration />
      </div>
      <div className="auth-container">
        <div className="auth-brand">
          <div className="auth-logo"><KanbanSquare size={22} /></div>
          <span className="auth-logo-text">ZedBoard</span>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1>Create {defaultRole === 'admin' ? 'Admin' : 'Member'} Account</h1>
            <p>Get started with ZedBoard</p>
          </div>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="form-input-icon-wrapper">
                <UserCircle size={16} className="form-input-icon" />
                <input className="form-input form-input-with-icon" placeholder="John Doe"
                  value={name} onChange={e => setName(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="form-input-icon-wrapper">
                <Mail size={16} className="form-input-icon" />
                <input className="form-input form-input-with-icon" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-icon-wrapper">
                <Lock size={16} className="form-input-icon" />
                <input className="form-input form-input-with-icon" type="password" placeholder="Min 6 characters"
                  value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Organization</label>
              <input className="form-input" placeholder="Company Name (Optional)"
                value={organization} onChange={e => setOrganization(e.target.value)} />
            </div>

            <div className="flex gap-md">
              <div className="form-group flex-1">
                <label className="form-label">Department</label>
                <input className="form-input" placeholder="e.g. Engineering"
                  value={department} onChange={e => setDepartment(e.target.value)} />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Designation</label>
                <input className="form-input" placeholder="e.g. Senior Dev"
                  value={designation} onChange={e => setDesignation(e.target.value)} />
              </div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? <div className="loader loader-sm" /> : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
