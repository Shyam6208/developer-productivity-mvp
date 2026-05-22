const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  DATA_DIR: path.join(__dirname, 'data'),
  DB_PATHS: {
    developers: path.join(__dirname, 'data/developers.json'),
    commits: path.join(__dirname, 'data/commits.json'),
    pullRequests: path.join(__dirname, 'data/pull_requests.json'),
    deployments: path.join(__dirname, 'data/deployments.json'),
  }
};
