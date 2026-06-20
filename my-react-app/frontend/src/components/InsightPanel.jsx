import { useState } from 'react';
import api from '../services/api';

const InsightPanel = ({ ideaId }) => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runFeasibility = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/admin/insights/feasibility/${ideaId}`);
      setInsight({ type: 'feasibility', data: res.data.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate insight');
    } finally {
      setLoading(false);
    }
  };

  const runResources = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post(`/admin/insights/resources/${ideaId}`);
      setInsight({ type: 'resources', data: res.data.data });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate insight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '10px', padding: '12px', background: '#F8F9FA', borderRadius: '8px', border: '1px solid #ECEFF1' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: insight ? '10px' : 0 }}>
        <button onClick={runFeasibility} disabled={loading} style={aiBtnStyle}>
          {loading ? 'Analyzing...' : '✨ AI Feasibility & ROI'}
        </button>
        <button onClick={runResources} disabled={loading} style={aiBtnStyle}>
          {loading ? 'Analyzing...' : '✨ AI Resource Plan'}
        </button>
      </div>

      {error && <p style={{ color: '#C0392B', fontSize: '12px' }}>{error}</p>}

      {insight?.type === 'feasibility' && (
        <div style={{ fontSize: '13px', color: '#2C3E50' }}>
          <p><strong>Feasibility:</strong> {insight.data.feasibilityScore}/10 | <strong>ROI:</strong> {insight.data.roiScore}/10 | <strong>Complexity:</strong> {insight.data.complexity}</p>
          <p><strong>Overall:</strong> {insight.data.overallScore}/10</p>
          <p style={{ fontStyle: 'italic', color: '#7F8C8D' }}>{insight.data.reasoning}</p>
        </div>
      )}

      {insight?.type === 'resources' && (
        <div style={{ fontSize: '13px', color: '#2C3E50' }}>
          <p><strong>Roles:</strong> {insight.data.recommendedRoles?.join(', ')}</p>
          <p><strong>Skills:</strong> {insight.data.keySkills?.join(', ')}</p>
          <p><strong>Suggested team size:</strong> {insight.data.suggestedTeamSize}</p>
          <p style={{ fontStyle: 'italic', color: '#7F8C8D' }}>{insight.data.notes}</p>
        </div>
      )}
    </div>
  );
};

const aiBtnStyle = {
  background: '#0A2947', color: '#DAA520', border: 'none', padding: '7px 12px',
  borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
};

export default InsightPanel;