import React from 'react';

export default function InsightsPanel({ insights, loading }) {
  if (loading) {
    return (
      <div className="glass-card insights-panel" style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Generating AI Insights with Gemini...</p>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  const { riskLevel, bottleneck } = insights;

  return (
    <div className="glass-card insights-panel">
      <div className="ai-header-row">
        <div className="logo-container">
          <div className="logo-icon" style={{ width: 28, height: 28, fontSize: '0.85rem', borderRadius: '6px' }}>AI</div>
          <h3 className="chart-title">AI Bottleneck Analysis</h3>
        </div>
        <div className="risk-indicator-box">
          <span>Risk Level:</span>
          <span className={`risk-badge ${riskLevel}`}>
            {riskLevel}
          </span>
        </div>
      </div>

      <div className="bottleneck-box">
        <p>{bottleneck}</p>
      </div>
    </div>
  );
}
