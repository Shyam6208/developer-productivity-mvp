import React from 'react';

export default function MetricCard({ metricKey, metricData }) {
  if (!metricData) return null;

  const { value, label, teamAverage } = metricData;

  // Determine performance color delta logic:
  // For Lead Time, Cycle Time, and Bug Rate: LOWER is better.
  // For Deployment Frequency and PR Throughput: HIGHER is better.
  const lowerIsBetterKeys = ['leadTime', 'cycleTime', 'bugRate'];
  const isLowerBetter = lowerIsBetterKeys.includes(metricKey);

  let statusClass = 'equal';
  let deltaText = 'Equal to Avg';

  if (value !== teamAverage) {
    if (isLowerBetter) {
      if (value < teamAverage) {
        statusClass = 'better';
        const diff = (teamAverage - value).toFixed(1);
        deltaText = `-${diff} days vs Avg`;
        if (metricKey === 'bugRate') deltaText = `-${diff}% vs Avg`;
      } else {
        statusClass = 'worse';
        const diff = (value - teamAverage).toFixed(1);
        deltaText = `+${diff} days vs Avg`;
        if (metricKey === 'bugRate') deltaText = `+${diff}% vs Avg`;
      }
    } else {
      if (value > teamAverage) {
        statusClass = 'better';
        const diff = (value - teamAverage).toFixed(1);
        deltaText = `+${diff} vs Avg`;
      } else {
        statusClass = 'worse';
        const diff = (teamAverage - value).toFixed(1);
        deltaText = `-${diff} vs Avg`;
      }
    }
  }

  // Helper suffix
  let valueSuffix = '';
  if (metricKey === 'leadTime' || metricKey === 'cycleTime') valueSuffix = ' d';
  if (metricKey === 'bugRate') valueSuffix = '%';

  return (
    <div className={`glass-card metric-card ${metricKey}`}>
      <span className="metric-label">{label}</span>
      <div className="metric-value-container">
        <span className="metric-value">{value}{valueSuffix}</span>
      </div>
      <div className="metric-team-avg">
        <span>Team Avg: {teamAverage}{valueSuffix}</span>
        <span className={`metric-delta ${statusClass}`}>
          {deltaText}
        </span>
      </div>
    </div>
  );
}
