const { execSync } = require('child_process');
const path = require('path');

console.log('Starting full-stack build...');

const run = (cmd, dir) => {
  console.log(`\n--- Running: ${cmd} in ${dir} ---`);
  execSync(cmd, { cwd: path.join(__dirname, dir), stdio: 'inherit' });
};

try {
  run('npm install', 'frontend');
  run('npm run build', 'frontend');
  run('npm install', 'backend');
  console.log('\nBuild completed successfully!');
} catch (error) {
  console.error('\nBuild failed:', error);
  process.exit(1);
}
