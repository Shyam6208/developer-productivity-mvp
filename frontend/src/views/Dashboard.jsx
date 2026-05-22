import React, { useEffect } from 'react';
import { useStore } from '../store';
import MetricCard from '../components/MetricCard';
import DashboardCharts from '../components/DashboardCharts';
import InsightsPanel from '../components/InsightsPanel';
import ActionsList from '../components/ActionsList';

export default function Dashboard({ developerId, onBack }) {
  const { 
    developers, 
    metrics, 
    charts, 
    insights, 
    loading, 
    insightsLoading, 
    error, 
    selectDeveloper 
  } = useStore();

  useEffect(() => {
    if (developerId) {
      selectDeveloper(developerId);
    }
  }, [developerId, selectDeveloper]);

  const currentDev = developers.find(d => d.id === developerId);

  if (loading && !metrics) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)' }}>Calculating engineering metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginTop: '4rem' }}>
        <div className="error-container">
          <h2>Error loading dashboard</h2>
          <p style={{ margin: '1rem 0' }}>{error}</p>
          <button className="back-btn" onClick={onBack} style={{ margin: '0 auto' }}>
            Back to Developer List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Top Header */}
      <div className="header">
        {currentDev ? (
          <div className="dev-profile-header">
            <img 
              className="dev-avatar" 
              src={currentDev.avatar} 
              alt={currentDev.name} 
              onError={(e) => {
                // Fallback avatar if api fails
                e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${currentDev.name}`;
              }}
            />
            <div>
              <h2 className="dev-name-title">{currentDev.name}</h2>
              <span className="dev-role-subtitle">{currentDev.role}</span>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="dev-name-title">Developer Dashboard</h2>
          </div>
        )}
        
        <button className="back-btn" onClick={onBack}>
          ← Select Developer
        </button>
      </div>

      {metrics && (
        <>
          {/* Core Metrics Grid (5 cards) */}
          <div className="metrics-grid">
            <MetricCard metricKey="leadTime" metricData={metrics.leadTime} />
            <MetricCard metricKey="cycleTime" metricData={metrics.cycleTime} />
            <MetricCard metricKey="bugRate" metricData={metrics.bugRate} />
            <MetricCard metricKey="deploymentFrequency" metricData={metrics.deploymentFrequency} />
            <MetricCard metricKey="prThroughput" metricData={metrics.prThroughput} />
          </div>

          {/* Sub-grid: Charts on Left, AI Insights on Right */}
          <div className="dashboard-grid">
            <div className="left-column">
              <DashboardCharts chartsData={charts} />
            </div>
            
            <div className="right-column">
              <InsightsPanel insights={insights} loading={insightsLoading} />
              <ActionsList insights={insights} loading={insightsLoading} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
