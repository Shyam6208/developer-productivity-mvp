import React, { useState } from 'react';
import Overview from './views/Overview';
import Dashboard from './views/Dashboard';

export default function App() {
  const [view, setView] = useState('overview'); // 'overview' | 'dashboard'
  const [selectedDevId, setSelectedDevId] = useState(null);

  const handleLaunchDashboard = (devId) => {
    setSelectedDevId(devId);
    setView('dashboard');
  };

  const handleBackToOverview = () => {
    setView('overview');
    setSelectedDevId(null);
  };

  return (
    <div className="app-container">
      {/* Branding Navigation Header */}
      {view === 'dashboard' && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div className="logo-container">
            <div className="logo-icon">⚡</div>
            <h1 className="logo-title">DevPulse AI</h1>
          </div>
        </div>
      )}

      {/* Page Routing/Switching */}
      {view === 'overview' ? (
        <Overview onLaunch={handleLaunchDashboard} />
      ) : (
        <Dashboard 
          developerId={selectedDevId} 
          onBack={handleBackToOverview} 
        />
      )}
      
      {/* Small footer */}
      <footer style={{ 
        marginTop: 'auto', 
        paddingTop: '3rem', 
        textAlign: 'center', 
        fontSize: '0.8rem', 
        color: 'var(--text-dark)' 
      }}>
        DevPulse AI MVP • Built for Engineering Productivity Analysis
      </footer>
    </div>
  );
}
