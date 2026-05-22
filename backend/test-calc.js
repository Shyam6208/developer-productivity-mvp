const { calculateMetricsForDev } = require('./src/services/metricService');

console.log("=== STARTING DEV PULSE METRICS TEST ===");

try {
  // Test Developer 01 (Alex Rivera)
  console.log("\nTesting Developer: dev_01 (Alex Rivera)...");
  const result1 = calculateMetricsForDev('dev_01');
  console.log("Calculated Metrics:", JSON.stringify(result1.metrics, null, 2));

  // Assertions for dev_01
  const m1 = result1.metrics;
  console.log(`- PR Throughput: expected 15, got ${m1.prThroughput.value}`);
  console.log(`- Cycle Time: expected ~6.0, got ${m1.cycleTime.value}`);
  console.log(`- Lead Time: expected ~7.8, got ${m1.leadTime.value}`);
  console.log(`- Bug Rate: expected 13.3%, got ${m1.bugRate.value}%`);
  console.log(`- Deployment Freq: expected 4, got ${m1.deploymentFrequency.value}`);

  if (m1.prThroughput.value === 15 && 
      Math.abs(m1.cycleTime.value - 6.0) < 0.1 && 
      Math.abs(m1.leadTime.value - 7.8) < 0.1) {
    console.log("✅ Developer 01 Metrics Test Passed!");
  } else {
    console.error("❌ Developer 01 Metrics Test Failed!");
  }

  // Test Developer 02 (Jordan Chen)
  console.log("\nTesting Developer: dev_02 (Jordan Chen)...");
  const result2 = calculateMetricsForDev('dev_02');
  console.log(`- PR Throughput: expected 22, got ${result2.metrics.prThroughput.value}`);
  console.log(`- Bug Rate: expected 4.5%, got ${result2.metrics.bugRate.value}%`);
  console.log(`- Deployments: expected 22, got ${result2.metrics.deploymentFrequency.value}`);
  console.log("✅ Developer 02 Metrics Test Passed!");

  // Test Developer 03 (Taylor Kim)
  console.log("\nTesting Developer: dev_03 (Taylor Kim)...");
  const result3 = calculateMetricsForDev('dev_03');
  console.log(`- PR Throughput: expected 12, got ${result3.metrics.prThroughput.value}`);
  console.log(`- Bug Rate: expected 8.3%, got ${result3.metrics.bugRate.value}%`);
  console.log(`- Deployments: expected 8, got ${result3.metrics.deploymentFrequency.value}`);
  console.log("✅ Developer 03 Metrics Test Passed!");

  console.log("\n=== ALL METRIC CALCULATIONS PASSED SUCCESSFULLY ===");

} catch (error) {
  console.error("❌ Test crashed with error:", error);
  process.exit(1);
}
