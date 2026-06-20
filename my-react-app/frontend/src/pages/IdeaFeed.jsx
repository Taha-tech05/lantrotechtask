import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import IdeaCard from '../components/IdeaCard';

const IdeaFeed = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/ideas?sortBy=votes').then((res) => setIdeas(res.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <header style={{
        background: '#0A2947', padding: '14px 24px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '19px' }}>💡 IdeaHub</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ color: '#DAA520', fontSize: '14px', fontWeight: 600 }}>Hi, {user?.name}</span>
          <button onClick={logout} style={{ background: 'none', border: '1px solid #DAA520', color: '#DAA520', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Composer card — clicking routes to full submit form */}
        <div
          onClick={() => navigate('/submit-idea')}
          style={{
            display: 'flex', gap: '12px', background: '#fff', borderRadius: '14px',
            padding: '16px', marginBottom: '20px', border: '1px solid #ECEFF1', cursor: 'pointer',
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: '50%', background: '#0A2947', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '8px 0', color: '#7F8C8D', fontSize: '15px' }}>Got an idea worth pitching?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{
                background: '#DAA520', color: '#0A2947', padding: '7px 18px',
                borderRadius: '20px', fontWeight: 700, fontSize: '13px',
              }}>
                Pitch idea
              </span>
            </div>
          </div>
        </div>

        {loading && <p style={{ textAlign: 'center', color: '#7F8C8D' }}>Loading ideas...</p>}
        {!loading && ideas.length === 0 && <p style={{ textAlign: 'center', color: '#7F8C8D' }}>No ideas yet — be the first!</p>}

        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} currentUserId={user?.id} />
        ))}
      </main>
    </div>
  );
};

export default IdeaFeed;