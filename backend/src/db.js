const fs = require('fs');
const config = require('./config');

function readData(modelName) {
  const filePath = config.DB_PATHS[modelName];
  if (!filePath) {
    throw new Error(`Invalid model name: ${modelName}`);
  }
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading database file at ${filePath}:`, error);
    return [];
  }
}

module.exports = {
  readData
};
