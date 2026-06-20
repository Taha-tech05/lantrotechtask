import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

const AdminMetrics = () => {
    const [metrics, setMetrics] = useState([]);
    const [trending, setTrending] = useState([]);
    const [clusters, setClusters] = useState(null);
    const [clustering, setClustering] = useState(false);

    useEffect(() => {
        api.get('/admin/metrics').then((res) => setMetrics(res.data.data));
        api.get('/admin/trending').then((res) => setTrending(res.data.data));
    }, []);

    const runClustering = async () => {
        setClustering(true);
        const res = await api.post('/admin/insights/clusters');
        setClusters(res.data.data);
        setClustering(false);
    };

    return (
        <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 16px' }}>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ color: '#0A2947' }}>🔥 Trending Ideas (last 7 days)</h2>
                    {trending.length === 0 && <p style={{ color: '#7F8C8D', fontSize: '14px' }}>No recent activity yet.</p>}
                    {trending.map((t, i) => (
                        <div key={t.id} style={{ background: '#fff', padding: '14px 18px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', boxShadow: '0 2px 6px rgba(10,41,71,0.05)' }}>
                            <span style={{ color: '#0A2947', fontWeight: 600 }}>#{i + 1} {t.title}</span>
                            <span style={{ color: '#DAA520', fontWeight: 700, fontSize: '13px' }}>Score: {t.trendScore}</span>
                        </div>
                    ))}
                </section>

                <section style={{ marginBottom: '32px' }}>
                    <h2 style={{ color: '#0A2947' }}>📊 Engagement Metrics</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
                        <thead>
                            <tr style={{ background: '#0A2947', color: '#fff', textAlign: 'left' }}>
                                <th style={thStyle}>Idea</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Votes</th>
                                <th style={thStyle}>Comments</th>
                                <th style={thStyle}>Engagement Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.map((m) => (
                                <tr key={m.id} style={{ borderBottom: '1px solid #F0F2F4' }}>
                                    <td style={tdStyle}>{m.title}</td>
                                    <td style={tdStyle}>{m.status}</td>
                                    <td style={tdStyle}>{m.voteCount}</td>
                                    <td style={tdStyle}>{m.commentCount}</td>
                                    <td style={{ ...tdStyle, color: '#DAA520', fontWeight: 700 }}>{m.engagementScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h2 style={{ color: '#0A2947', margin: 0 }}>🧩 AI Theme Clusters</h2>
                        <button onClick={runClustering} disabled={clustering} style={{ background: '#0A2947', color: '#DAA520', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                            {clustering ? 'Clustering...' : '✨ Generate Clusters'}
                        </button>
                    </div>
                    {clusters?.map((c, i) => (
                        <div key={i} style={{ background: '#fff', padding: '14px 18px', borderRadius: '8px', marginBottom: '10px', boxShadow: '0 2px 6px rgba(10,41,71,0.05)' }}>
                            <strong style={{ color: '#0A2947' }}>{c.theme}</strong>
                            <p style={{ fontSize: '13px', color: '#2C3E50', margin: '4px 0' }}>{c.description}</p>
                            <p style={{ fontSize: '12px', color: '#7F8C8D', marginBottom: '8px' }}>{c.ideas?.length} ideas grouped</p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {c.ideas?.map((idea) => (
                                    <span
                                        key={idea.id}
                                        style={{
                                            fontSize: '12px', background: '#F8F9FA', color: '#0A2947',
                                            padding: '4px 10px', borderRadius: '12px', border: '1px solid #D9DEE3',
                                        }}
                                    >
                                        {idea.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
};

const thStyle = { padding: '12px 16px', fontSize: '13px' };
const tdStyle = { padding: '12px 16px', fontSize: '13px', color: '#2C3E50' };

export default AdminMetrics;