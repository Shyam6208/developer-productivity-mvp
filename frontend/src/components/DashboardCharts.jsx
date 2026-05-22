import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function DashboardCharts({ chartsData }) {
  if (!chartsData) return null;
  const { velocity, cycleLead } = chartsData;

  // Custom tooltips styling to match the dark glassmorphic layout
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
        }}>
          <p style={{ margin: '0 0 0.25rem', fontWeight: 600, fontSize: '0.85rem', color: '#9ca3af' }}>{label}</p>
          {payload.map((item, index) => (
            <p key={index} style={{ margin: 0, fontSize: '0.9rem', color: item.color || item.fill, fontWeight: 500 }}>
              {item.name}: {item.value} {item.name.toLowerCase().includes('time') ? 'days' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-section">
      {/* Chart 1: Velocity Chart (weekly commits vs PRs) */}
      <div className="glass-card chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Velocity History</h3>
            <span className="chart-subtitle">Weekly commits and merged PRs count</span>
          </div>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={velocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.85rem' }} />
              <Bar name="Commits" dataKey="commits" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar name="Merged PRs" dataKey="prs" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Cycle vs. Lead Time Trend */}
      <div className="glass-card chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Cycle vs. Lead Time Trend</h3>
            <span className="chart-subtitle">Process efficiency across the last 10 merged PRs</span>
          </div>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={cycleLead} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '0.75rem' }} tick={false} />
              <YAxis stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '0.85rem' }} />
              <Line name="Cycle Time" type="monotone" dataKey="cycleTime" stroke="#3b82f6" strokeWidth={2.5} activeDot={{ r: 6 }} />
              <Line name="Lead Time" type="monotone" dataKey="leadTime" stroke="#a855f7" strokeWidth={2.5} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
