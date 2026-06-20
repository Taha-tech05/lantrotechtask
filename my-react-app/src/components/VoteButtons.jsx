import { useState } from 'react';
import api from '../services/api';

const VoteButtons = ({ idea, currentUserId }) => {
  const initiallyVoted = idea.votes?.some((v) => v.userId === currentUserId);
  const [voted, setVoted] = useState(initiallyVoted || false);
  const [count, setCount] = useState(idea._count?.votes ?? idea.votes?.length ?? 0);

  const handleVote = async () => {
    setVoted(!voted);
    setCount((c) => (voted ? c - 1 : c + 1));
    try {
      await api.post(`/ideas/${idea.id}/vote`);
    } catch {
      setVoted(voted);
      setCount((c) => (voted ? c + 1 : c - 1));
    }
  };

  return (
    <button
      onClick={handleVote}
      style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <span style={{ fontSize: '18px', color: voted ? '#DAA520' : '#2C3E50', transition: 'color 0.15s' }}>
        {voted ? '★' : '☆'}
      </span>
      <span style={{ fontSize: '13px', color: voted ? '#DAA520' : '#2C3E50', fontWeight: 600 }}>{count}</span>
    </button>
  );
};

export default VoteButtons;