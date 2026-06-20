import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import InsightPanel from '../components/InsightPanel';

const STATUSES = ['REVIEWING', 'APPROVED', 'FUNDING_ALLOCATED', 'ARCHIVED'];

const LeadershipPanel = () => {
  const [ideas, setIdeas] = useState([]);
  const [openInsight, setOpenInsight] = useState(null);
  const [openComments, setOpenComments] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchIdeas = () => api.get('/ideas').then((res) => setIdeas(res.data.data));

  useEffect(() => { fetchIdeas(); }, []);

  const changeStatus = async (id, status) => {
    await api.patch(`/admin/ideas/${id}/status`, { status });
    fetchIdeas();
  };

  const toggleComments = async (ideaId) => {
    const willOpen = openComments !== ideaId;
    setOpenComments(willOpen ? ideaId : null);

    if (willOpen && !commentsMap[ideaId]) {
      setLoadingComments(true);
      try {
        const res = await api.get(`/ideas/${ideaId}`);
        setCommentsMap((prev) => ({ ...prev, [ideaId]: res.data.data.comments || [] }));
      } finally {
        setLoadingComments(false);
      }
    }
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 16px' }}>
        <h2 style={{ color: '#0A2947', marginBottom: '20px' }}>Submitted Ideas</h2>
        {ideas.map((idea) => (
          <div key={idea.id} style={{ background: '#fff', borderRadius: '10px', padding: '18px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(10,41,71,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: '#0A2947', margin: '0 0 6px' }}>{idea.title}</h3>
                <p style={{ color: '#2C3E50', fontSize: '14px', margin: '0 0 8px' }}>{idea.pitch}</p>
                <p style={{ fontSize: '12px', color: '#7F8C8D' }}>
                  By {idea.author?.name} · ${Number(idea.estimatedBudget).toLocaleString()} · {idea._count?.votes ?? 0} votes · {idea._count?.comments ?? 0} comments
                </p>
              </div>
              <select
                value={idea.status}
                onChange={(e) => changeStatus(idea.id, e.target.value)}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D9DEE3', fontSize: '12px', fontWeight: 600, color: '#0A2947' }}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                onClick={() => setOpenInsight(openInsight === idea.id ? null : idea.id)}
                style={{ background: 'none', border: '1px solid #DAA520', color: '#DAA520', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                {openInsight === idea.id ? 'Hide AI Insights' : '✨ AI Insights'}
              </button>

              <button
                onClick={() => toggleComments(idea.id)}
                style={{ background: 'none', border: '1px solid #0A2947', color: '#0A2947', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              >
                💬 {openComments === idea.id ? 'Hide Comments' : `View Comments (${idea._count?.comments ?? 0})`}
              </button>
            </div>

            {openInsight === idea.id && <InsightPanel ideaId={idea.id} />}

            {openComments === idea.id && (
              <div style={{ marginTop: '12px', padding: '12px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid #ECEFF1' }}>
                {loadingComments && !commentsMap[idea.id] && (
                  <p style={{ fontSize: '12px', color: '#7F8C8D' }}>Loading comments...</p>
                )}
                {commentsMap[idea.id]?.length === 0 && (
                  <p style={{ fontSize: '12px', color: '#7F8C8D' }}>No comments yet.</p>
                )}
                {commentsMap[idea.id]?.map((c) => (
                  <p key={c.id} style={{ fontSize: '13px', color: '#2C3E50', marginBottom: '6px' }}>
                    <strong>{c.author?.name}</strong> {c.content}
                    <span style={{ color: '#7F8C8D', fontSize: '11px', marginLeft: '8px' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default LeadershipPanel;