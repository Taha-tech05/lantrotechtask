import { useState } from 'react';
import VoteButtons from './VoteButtons';
import CommentList from './CommentList';

const statusColors = {
    REVIEWING: '#DAA520',
    APPROVED: '#2A75D3',
    FUNDING_ALLOCATED: '#1E8449',
    ARCHIVED: '#7F8C8D',
};

const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
};

const IdeaCard = ({ idea, currentUserId }) => {
    const [commentsOpen, setCommentsOpen] = useState(false);

    return (
        <div style={{
            background: '#FFFFFF', borderRadius: '14px', marginBottom: '18px',
            border: '1px solid #ECEFF1', overflow: 'hidden',
        }}>
            {/* Header — avatar, name, handle, timestamp */}
            <div style={{ display: 'flex', gap: '10px', padding: '14px 16px 8px' }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '50%', background: '#0A2947',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '16px', flexShrink: 0,
                }}>
                    {idea.author?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: '#0A2947', fontSize: '14.5px' }}>{idea.author?.name}</span>
                        <span style={{ color: '#7F8C8D', fontSize: '13px' }}>
                            @{idea.author?.department?.toLowerCase().replace(/\s+/g, '') || 'employee'}
                        </span>
                        <span style={{ color: '#7F8C8D', fontSize: '13px' }}>· {timeAgo(idea.submissionDate)}</span>
                    </div>
                    <span style={{
                        display: 'inline-block', marginTop: '4px', fontSize: '10.5px', fontWeight: 700,
                        color: '#fff', padding: '2px 9px', borderRadius: '10px',
                        background: statusColors[idea.status] || '#7F8C8D', letterSpacing: '0.3px',
                    }}>
                        {idea.status?.replace('_', ' ')}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '0 16px 12px 70px' }}>
                <h3 style={{ color: '#0A2947', fontSize: '16px', margin: '0 0 6px', fontWeight: 700 }}>{idea.title}</h3>
                <p style={{ color: '#2C3E50', fontSize: '14.5px', lineHeight: 1.5, margin: '0 0 10px' }}>{idea.pitch}</p>
            </div>

            {/* Banner — gradient card showing key stats (stands in for the "image") */}
            <div style={{ margin: '0 16px 16px 70px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0A2947 0%, #173A5E 60%, #DAA520 140%)',
                    borderRadius: '12px', padding: '22px 20px', color: '#fff', position: 'relative',
                }}>
                    <p style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: '#DAA520', margin: '0 0 6px', fontWeight: 700 }}>
                        {idea.category || 'General'}
                    </p>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, margin: '0 0 16px', color: '#F0F2F4', maxWidth: '85%' }}>
                        {idea.expectedImpact}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12.5px', flexWrap: 'wrap' }}>
                        <span>💰 ${Number(idea.estimatedBudget).toLocaleString()}</span>
                        <span>👥 {idea.requiredTeamSize} people</span>
                        <span>⚑ {idea.priority}</span>
                        <span>📅 {new Date(idea.submissionDate).toLocaleDateString()}</span>

                    </div>
                </div>

                {idea.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {idea.tags.map((t) => (
                            <span key={t.tag.id} style={{ fontSize: '12px', background: '#F8F9FA', color: '#0A2947', padding: '3px 10px', borderRadius: '10px', border: '1px solid #D9DEE3' }}>
                                #{t.tag.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Action row */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '28px', padding: '4px 16px 14px 70px',
                borderTop: '1px solid #F0F2F4',
            }}>
                <VoteButtons idea={idea} currentUserId={currentUserId} />

                <button
                    onClick={() => setCommentsOpen(!commentsOpen)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                    <span style={{ fontSize: '18px' }}>💬</span>
                    <span style={{ fontSize: '13px', color: '#2C3E50', fontWeight: 600 }}>{idea._count?.comments ?? 0}</span>
                </button>

                <button style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'default', padding: 0, opacity: 0.5 }}>
                    <span style={{ fontSize: '17px' }}>↗</span>
                </button>
            </div>

            {commentsOpen && <CommentList idea={idea} forceOpen />}
        </div>
    );
};

export default IdeaCard;