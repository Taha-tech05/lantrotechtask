import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' },
  card: { background: '#FFFFFF', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(10,41,71,0.1)', width: '380px' },
  title: { color: '#0A2947', fontSize: '26px', fontWeight: 700, marginBottom: '4px' },
  subtitle: { color: '#2C3E50', fontSize: '14px', marginBottom: '24px', opacity: 0.7 },
  input: { width: '100%', padding: '12px 14px', marginBottom: '14px', border: '1px solid #D9DEE3', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  button: { width: '100%', padding: '12px', background: '#0A2947', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
  error: { color: '#C0392B', fontSize: '13px', marginBottom: '10px' },
  footer: { marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#2C3E50' },
  link: { color: '#DAA520', fontWeight: 600, textDecoration: 'none' },
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.subtitle}>Join the innovation pipeline</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
          <input style={styles.input} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={styles.input} name="department" placeholder="Department (optional)" value={form.department} onChange={handleChange} />
          <input style={styles.input} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button style={styles.button} type="submit">Sign Up</button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;