const db = require('../db');

function calculateMetricsForDev(developerId) {
  const prs = db.readData('pullRequests');
  const commits = db.readData('commits');
  const deployments = db.readData('deployments');
  const developers = db.readData('developers');

  const devCount = developers.length || 1;

  // Filter records for target developer
  const devPRs = prs.filter(pr => pr.developerId === developerId);
  const devCommits = commits.filter(c => c.developerId === developerId);
  const devDeployments = deployments.filter(d => d.developerId === developerId);

  // 1. Calculate Dev Metrics
  const devPrCount = devPRs.length;
  
  let devAvgLeadTime = 0;
  let devAvgCycleTime = 0;
  let devBugRate = 0;

  if (devPrCount > 0) {
    const totalLeadTime = devPRs.reduce((sum, pr) => sum + pr.leadTimeDays, 0);
    const totalCycleTime = devPRs.reduce((sum, pr) => sum + pr.cycleTimeDays, 0);
    const bugCount = devPRs.filter(pr => pr.isBug).length;

    devAvgLeadTime = Number((totalLeadTime / devPrCount).toFixed(1));
    devAvgCycleTime = Number((totalCycleTime / devPrCount).toFixed(1));
    devBugRate = Number(((bugCount / devPrCount) * 100).toFixed(1));
  }

  const devDeployCount = devDeployments.length; // Deployments/month (since dataset spans 30 days)

  // 2. Calculate Team Metrics (Averages per developer or overall system averages)
  const totalPRCount = prs.length;
  let teamAvgLeadTime = 0;
  let teamAvgCycleTime = 0;
  let teamBugRate = 0;

  if (totalPRCount > 0) {
    const systemTotalLeadTime = prs.reduce((sum, pr) => sum + pr.leadTimeDays, 0);
    const systemTotalCycleTime = prs.reduce((sum, pr) => sum + pr.cycleTimeDays, 0);
    const systemBugCount = prs.filter(pr => pr.isBug).length;

    teamAvgLeadTime = Number((systemTotalLeadTime / totalPRCount).toFixed(1));
    teamAvgCycleTime = Number((systemTotalCycleTime / totalPRCount).toFixed(1));
    teamBugRate = Number(((systemBugCount / totalPRCount) * 100).toFixed(1));
  }

  const teamAvgDeployCount = Number((deployments.length / devCount).toFixed(1));
  const teamAvgPrThroughput = Number((totalPRCount / devCount).toFixed(1));

  // 3. Generate Chart 1: Velocity Chart (Commits and PRs over last 4 weeks)
  // Let's divide the last 30 days into 4 weekly buckets
  const now = new Date("2026-05-22T08:00:00Z"); // Mock local current time
  const weeks = Array.from({ length: 4 }).map((_, idx) => {
    const end = new Date(now.getTime() - idx * 7 * 24 * 60 * 60 * 1000);
    const start = new Date(now.getTime() - (idx + 1) * 7 * 24 * 60 * 60 * 1000);
    return { start, end, label: `Week ${4 - idx}` };
  }).reverse();

  const velocityChart = weeks.map(w => {
    const weeklyCommits = devCommits.filter(c => {
      const t = new Date(c.timestamp);
      return t >= w.start && t < w.end;
    }).length;

    const weeklyPRs = devPRs.filter(pr => {
      const t = new Date(pr.mergedAt);
      return t >= w.start && t < w.end;
    }).length;

    return {
      name: w.label,
      commits: weeklyCommits,
      prs: weeklyPRs
    };
  });

  // 4. Generate Chart 2: Cycle vs. Lead Time Trend (Last 10 PRs)
  const sortedPRs = [...devPRs]
    .sort((a, b) => new Date(a.mergedAt) - new Date(b.mergedAt))
    .slice(-10);

  const cycleLeadChart = sortedPRs.map((pr, idx) => ({
    name: pr.title.length > 20 ? `${pr.title.slice(0, 17)}...` : pr.title,
    cycleTime: pr.cycleTimeDays,
    leadTime: pr.leadTimeDays
  }));

  return {
    developerId,
    metrics: {
      leadTime: { value: devAvgLeadTime, label: "Lead Time (days)", teamAverage: teamAvgLeadTime },
      cycleTime: { value: devAvgCycleTime, label: "Cycle Time (days)", teamAverage: teamAvgCycleTime },
      bugRate: { value: devBugRate, label: "Bug Rate (%)", teamAverage: teamBugRate },
      deploymentFrequency: { value: devDeployCount, label: "Deployments/Month", teamAverage: teamAvgDeployCount },
      prThroughput: { value: devPrCount, label: "PR Throughput", teamAverage: teamAvgPrThroughput }
    },
    charts: {
      velocity: velocityChart,
      cycleLead: cycleLeadChart
    }
  };
}

module.exports = {
  calculateMetricsForDev
};
