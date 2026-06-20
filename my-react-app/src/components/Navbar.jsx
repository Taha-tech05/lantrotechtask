import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const linkStyle = ({ isActive }) => ({
  padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
  color: isActive ? '#0A2947' : '#F8F9FA',
  background: isActive ? '#DAA520' : 'transparent',
});

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{ background: '#0A2947', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h2 style={{ color: '#fff', margin: 0, fontSize: '19px' }}>⚙ Admin Console</h2>
      <nav style={{ display: 'flex', gap: '10px' }}>
        <NavLink to="/admin/ideas" style={linkStyle}>Idea Pipeline</NavLink>
        <NavLink to="/admin/metrics" style={linkStyle}>Engagement & Trends</NavLink>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <span style={{ color: '#DAA520', fontSize: '13px', fontWeight: 600 }}>{user?.name}</span>
        <button onClick={logout} style={{ background: 'none', border: '1px solid #DAA520', color: '#DAA520', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;