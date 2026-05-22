const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

// Helper to generate local fallback suggestions if Gemini is not configured or fails.
// Implements intelligent, comparative analyses tailored to each developer profile.
function getLocalFallbackInsights(metrics) {
  const { leadTime, cycleTime, bugRate, deploymentFrequency, prThroughput } = metrics;
  
  // 1. Check for High Bug Rate (Alex Rivera profile)
  if (bugRate.value > 10) {
    const cycleDiffPct = Math.round(((cycleTime.value - cycleTime.teamAverage) / cycleTime.teamAverage) * 100);
    return {
      riskLevel: "HIGH",
      bottleneck: `Bug rate is significantly high at ${bugRate.value}% (${Math.round((bugRate.value - bugRate.teamAverage)/bugRate.teamAverage * 100)}% above team average), while cycle time is ${cycleDiffPct}% slower than average. This strongly suggests quality struggles are leading to heavy rework, code review rejection loops, and a depressed deployment rate.`,
      nextSteps: [
        "Incorporate a pre-commit hook running automated unit tests and linting to catch regressions early.",
        "Add a team peer-review checklist focused specifically on boundary value testing and database schema changes.",
        "Perform a post-mortem review on the last 3 critical bugs to identify systemic issues in local testing setups."
      ]
    };
  }
  
  // 2. Check for Low Throughput / Slow Cycle Time (Taylor Kim profile)
  if (cycleTime.value > 3.5 || prThroughput.value < 14) {
    const throughDiffPct = Math.round(((prThroughput.teamAverage - prThroughput.value) / prThroughput.teamAverage) * 100);
    return {
      riskLevel: "MODERATE",
      bottleneck: `PR throughput is ${throughDiffPct}% below team average, and deployment frequency is depressed. Although bug rate is stable, cycle time (${cycleTime.value} days) is elevated, suggesting work-in-progress batching where large pull requests are stuck waiting for review or staging deployment.`,
      nextSteps: [
        "Deconstruct features into small, independent milestones with pull requests under 200 lines of code.",
        "Implement feature flags to allow merging work-in-progress code safely to main without long-lived feature branches.",
        "Allocate 30 minutes at the start and end of each day specifically for code reviews to reduce review latency."
      ]
    };
  }

  // 3. High Performance baseline (Jordan Chen profile)
  const deployDiffPct = Math.round(((deploymentFrequency.value - deploymentFrequency.teamAverage) / deploymentFrequency.teamAverage) * 100);
  return {
    riskLevel: "LOW",
    bottleneck: `Velocity is exemplary, with deployment frequency ${deployDiffPct}% above team average and cycle times 50% faster. The primary opportunity is channelizing this speed into helping unblock general team bottlenecks.`,
    nextSteps: [
      "Share local automation scripts and hot-reloading configurations used to minimize local development cycles.",
      "Dedicate a fraction of daily capacity to pull request reviews to assist team members with slower lead times.",
      "Document current micro-PR workflows in the team wiki to establish a baseline standard for others."
    ]
  };
}

async function generateInsights(developerName, metrics) {
  const apiKey = config.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log("No GEMINI_API_KEY configured. Using local rule-based fallback service.");
    return getLocalFallbackInsights(metrics);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for speed and reliability in MVP
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `
      You are an expert Engineering Productivity AI Coach.
      Analyze the following productivity metrics for a software developer named ${developerName}:

      Developer Metrics:
      - Lead Time for Changes: ${metrics.leadTime.value} days (Team Average: ${metrics.leadTime.teamAverage} days)
      - Cycle Time: ${metrics.cycleTime.value} days (Team Average: ${metrics.cycleTime.teamAverage} days)
      - Bug Rate: ${metrics.bugRate.value}% (Team Average: ${metrics.bugRate.teamAverage}%)
      - Deployment Frequency: ${metrics.deploymentFrequency.value} deployments/month (Team Average: ${metrics.deploymentFrequency.teamAverage} deployments/month)
      - PR Throughput: ${metrics.prThroughput.value} merged PRs (Team Average: ${metrics.prThroughput.teamAverage} merged PRs)

      Your task is to write a highly intelligent, expert, and professional analysis of the developer's productivity.
      
      CRITICAL INSTRUCTIONS FOR ANALYSIS:
      1. DO NOT make generic, shallow statements like "Lead time is high."
      2. Provide a comparative and multi-variable analysis (e.g. correlate cycle time and bug rate, or lead time and PR throughput).
      3. For example: "Lead time is significantly above the team average while PR throughput is decreasing. This suggests review bottlenecks or oversized pull requests slowing deployment velocity."
      4. Suggest exactly 3 practical, actionable, and specific improvement recommendations. Make them technical and concrete.
      5. Classify the developer's current workflow risk profile as "LOW", "MODERATE", or "HIGH".
      
      Respond STRICTLY in JSON format with the following keys:
      {
        "riskLevel": "LOW" | "MODERATE" | "HIGH",
        "bottleneck": "A highly intelligent, comparative 2-sentence explanation of the primary bottleneck, explaining the correlations between their metrics and team averages.",
        "nextSteps": [
          "Technical actionable recommendation 1",
          "Technical actionable recommendation 2",
          "Technical actionable recommendation 3"
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Parse response
    const parsed = JSON.parse(text);
    
    // Validate response schema
    if (parsed.riskLevel && parsed.bottleneck && Array.isArray(parsed.nextSteps)) {
      return {
        riskLevel: parsed.riskLevel,
        bottleneck: parsed.bottleneck,
        nextSteps: parsed.nextSteps.slice(0, 3)
      };
    } else {
      throw new Error("Invalid schema returned from Gemini API");
    }
  } catch (error) {
    console.error("Failed to generate AI insights from Gemini. Falling back to local heuristics:", error);
    return getLocalFallbackInsights(metrics);
  }
}

module.exports = {
  generateInsights
};

