#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const coverageFile = path.join(__dirname, '../coverage/coverage-final.json');
const baselineFile = path.join(__dirname, '../coverage-baseline.json');

if (!fs.existsSync(coverageFile)) {
  console.error('❌ Coverage report not found. Run "npm run test:coverage" first.');
  process.exit(1);
}

if (!fs.existsSync(baselineFile)) {
  console.error('❌ Coverage baseline not found. Initialize with "npm run coverage:save".');
  process.exit(1);
}

const coverageData = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));

// Calculate coverage percentages from coverage-final.json
function calculateCoverage(data) {
  let statements = 0,
    branches = 0,
    functions = 0,
    lines = 0;
  let stmtCount = 0,
    branchCount = 0,
    funcCount = 0,
    lineCount = 0;

  Object.values(data).forEach(file => {
    if (file.s) {
      const stmtValues = Object.values(file.s);
      statements += stmtValues.filter(v => v > 0).length;
      stmtCount += stmtValues.length;
    }
    if (file.b) {
      const branchValues = Object.values(file.b).flat();
      branches += branchValues.filter(v => v > 0).length;
      branchCount += branchValues.length;
    }
    if (file.f) {
      const funcValues = Object.values(file.f);
      functions += funcValues.filter(v => v > 0).length;
      funcCount += funcValues.length;
    }
    if (file.l) {
      const lineValues = Object.values(file.l);
      lines += lineValues.filter(v => v > 0).length;
      lineCount += lineValues.length;
    }
  });

  return {
    statements: stmtCount > 0 ? Math.round((statements / stmtCount) * 100) : 100,
    branches: branchCount > 0 ? Math.round((branches / branchCount) * 100) : 100,
    functions: funcCount > 0 ? Math.round((functions / funcCount) * 100) : 100,
    lines: lineCount > 0 ? Math.round((lines / lineCount) * 100) : 100,
  };
}

const current = calculateCoverage(coverageData);
const base = baseline.coverage;

let failed = false;
const metrics = ['statements', 'branches', 'functions', 'lines'];

console.log('\n📊 Coverage Comparison:\n');
console.log('Metric       | Current | Baseline | Status');
console.log('-------------|---------|----------|--------');

metrics.forEach(metric => {
  const currentVal = current[metric];
  const baselineVal = base[metric];
  const status = currentVal >= baselineVal ? '✅' : '❌';

  if (currentVal < baselineVal) {
    failed = true;
  }

  console.log(
    `${metric.padEnd(12)} | ${String(currentVal).padStart(6)}% | ${String(baselineVal).padStart(7)}% | ${status}`
  );
});

console.log('');

if (failed) {
  console.error('❌ Coverage has decreased below baseline!');
  process.exit(1);
} else {
  console.log('✅ Coverage meets or exceeds baseline.');
  process.exit(0);
}
