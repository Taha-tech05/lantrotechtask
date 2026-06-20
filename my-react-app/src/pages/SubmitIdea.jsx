import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const inputStyle = { width: '100%', padding: '12px', marginBottom: '14px', border: '1px solid #D9DEE3', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' };

const SubmitIdea = () => {
  const [form, setForm] = useState({
    title: '', pitch: '', estimatedBudget: '', requiredTeamSize: '',
    expectedImpact: '', category: '', priority: 'MEDIUM', tags: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/ideas', {
      ...form,
      estimatedBudget: Number(form.estimatedBudget),
      requiredTeamSize: Number(form.requiredTeamSize),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh', padding: '40px 16px' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(10,41,71,0.08)' }}>
        <h2 style={{ color: '#0A2947', marginBottom: '20px' }}>Pitch your idea</h2>
        <input style={inputStyle} name="title" placeholder="Title" onChange={handleChange} required />
        <textarea style={{ ...inputStyle, minHeight: '90px' }} name="pitch" placeholder="Short pitch / description" onChange={handleChange} required />
        <input style={inputStyle} name="estimatedBudget" type="number" placeholder="Estimated budget ($)" onChange={handleChange} required />
        <input style={inputStyle} name="requiredTeamSize" type="number" placeholder="Required team size" onChange={handleChange} required />
        <textarea style={{ ...inputStyle, minHeight: '70px' }} name="expectedImpact" placeholder="Expected impact / benefits" onChange={handleChange} required />
        <input style={inputStyle} name="category" placeholder="Category" onChange={handleChange} />
        <input style={inputStyle} name="tags" placeholder="Tags (comma separated)" onChange={handleChange} />
        <select style={inputStyle} name="priority" onChange={handleChange} value={form.priority}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#0A2947', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
          Submit Idea
        </button>
      </form>
    </div>
  );
};

export default SubmitIdea;