import { useState, useEffect } from 'react';
import api from '../services/api';

const CommentList = ({ idea, forceOpen }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (forceOpen && !loaded) {
      setLoading(true);
      api.get(`/ideas/${idea.id}`)
        .then((res) => setComments(res.data.data.comments || []))
        .finally(() => { setLoading(false); setLoaded(true); });
    }
  }, [forceOpen, loaded, idea.id]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await api.post(`/ideas/${idea.id}/comments`, { content: text });
    setComments([res.data.data, ...comments]);
    setText('');
  };

  if (!forceOpen) return null;

  return (
    <div style={{ padding: '12px 16px 16px 70px', borderTop: '1px solid #F0F2F4' }}>
      <form onSubmit={submitComment} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          style={{ flex: 1, padding: '9px 14px', border: '1px solid #D9DEE3', borderRadius: '20px', fontSize: '13px', outline: 'none' }}
        />
        <button type="submit" style={{ background: '#0A2947', color: '#DAA520', border: 'none', borderRadius: '18px', padding: '0 16px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
          Post
        </button>
      </form>

      {loading && <p style={{ fontSize: '12px', color: '#7F8C8D' }}>Loading comments...</p>}
      {!loading && comments.length === 0 && <p style={{ fontSize: '12px', color: '#7F8C8D' }}>No comments yet — be the first.</p>}

      {!loading && comments.map((c) => (
        <div key={c.id} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%', background: '#DAA520', color: '#0A2947',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0,
          }}>
            {c.author?.name?.[0]?.toUpperCase()}
          </div>
          <p style={{ fontSize: '13px', color: '#2C3E50', margin: 0, lineHeight: 1.4 }}>
            <strong style={{ color: '#0A2947' }}>{c.author?.name}</strong>{' '}{c.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;