import React, { useEffect, useState } from 'react';
import { useStore } from '../store';

export default function Overview({ onLaunch }) {
  const { developers, loading, error, fetchDevelopers } = useStore();
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    fetchDevelopers();
  }, [fetchDevelopers]);

  const handleLaunch = () => {
    if (selectedId) {
      onLaunch(selectedId);
    }
  };

  return (
    <div className="selection-screen">
      <div style={{ marginBottom: '2.5rem' }}>
        <div className="logo-icon" style={{ margin: '0 auto 1.5rem', width: 60, height: 60, borderRadius: '15px', fontSize: '1.75rem' }}>⚡</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
          DevPulse AI
        </h1>
        <p className="hero-subtitle">
          Engineering productivity analytics powered by Gemini. Select a developer below to visualize velocity, compare team averages, and analyze bottlenecks.
        </p>
      </div>

      <div className="selection-box glass-card">
        {loading ? (
          <div style={{ padding: '1rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading developer profiles...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <h2 className="selection-title">Select Developer Profile</h2>
            <select 
              className="select-dropdown"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="" disabled>-- Select a Team Member --</option>
              {developers.map(dev => (
                <option key={dev.id} value={dev.id}>
                  {dev.name} ({dev.role})
                </option>
              ))}
            </select>

            <button 
              className="enter-btn"
              onClick={handleLaunch}
              disabled={!selectedId}
            >
              Launch Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
