const express = require('express');
const cors = require('cors');
const config = require('./config');
const db = require('./db');
const metricService = require('./services/metricService');
const geminiService = require('./services/geminiService');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
// 1. GET /api/developers - List all developers
app.get('/api/developers', (req, res, next) => {
  try {
    const devs = db.readData('developers');
    res.json(devs);
  } catch (error) {
    next(error);
  }
});

// 2. GET /api/metrics/:developerId - Get calculated metrics & chart data
app.get('/api/metrics/:developerId', (req, res, next) => {
  try {
    const { developerId } = req.params;
    const devs = db.readData('developers');
    const devExists = devs.some(d => d.id === developerId);

    if (!devExists) {
      return res.status(404).json({ error: "Developer not found" });
    }

    const calculatedData = metricService.calculateMetricsForDev(developerId);
    res.json(calculatedData);
  } catch (error) {
    next(error);
  }
});

// 3. GET /api/insights/:developerId - Get Gemini AI insights & actions
app.get('/api/insights/:developerId', async (req, res, next) => {
  try {
    const { developerId } = req.params;
    const devs = db.readData('developers');
    const dev = devs.find(d => d.id === developerId);

    if (!dev) {
      return res.status(404).json({ error: "Developer not found" });
    }

    // Get current calculated metrics to supply to Gemini
    const calculatedData = metricService.calculateMetricsForDev(developerId);
    
    // Call Gemini (or fallback helper) to generate structured insights
    const aiInsights = await geminiService.generateInsights(dev.name, calculatedData.metrics);
    res.json(aiInsights);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express Error Handler caught error:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Server if run directly
if (require.main === module) {
  app.listen(config.PORT, () => {
    console.log(`Express Developer Productivity backend listening on port ${config.PORT}`);
  });
}

module.exports = app;
