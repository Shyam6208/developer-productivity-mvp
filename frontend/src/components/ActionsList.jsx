import React, { useState, useEffect } from 'react';

export default function ActionsList({ insights, loading }) {
  const [completed, setCompleted] = useState({});

  // Reset checklist completion state when insights change
  useEffect(() => {
    setCompleted({});
  }, [insights]);

  if (loading) {
    return (
      <div className="glass-card" style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzing actions...</p>
        </div>
      </div>
    );
  }

  if (!insights || !insights.nextSteps) return null;

  const handleToggle = (index) => {
    setCompleted(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="glass-card" style={{ marginTop: '1.5rem' }}>
      <h3 className="recommendations-title">
        <span style={{ fontSize: '1.25rem' }}>⚡</span> Suggested Next Actions
      </h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
        Target these specific workflows to improve metrics relative to team averages:
      </p>
      
      <div className="rec-list">
        {insights.nextSteps.map((step, idx) => (
          <div 
            key={idx} 
            className="rec-item" 
            style={{ 
              opacity: completed[idx] ? 0.5 : 1,
              transition: 'opacity var(--transition-fast)'
            }}
          >
            <input 
              type="checkbox" 
              checked={!!completed[idx]} 
              onChange={() => handleToggle(idx)}
              style={{
                marginTop: '0.2rem',
                cursor: 'pointer',
                accentColor: 'var(--color-cyan)',
                width: '16px',
                height: '16px'
              }}
            />
            <span style={{ 
              textDecoration: completed[idx] ? 'line-through' : 'none',
              marginLeft: '0.5rem'
            }}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
