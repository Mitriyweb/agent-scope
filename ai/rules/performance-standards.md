# Performance Standards

## CLI Performance Requirements

### ⚠️ CRITICAL: CLI commands MUST start within 100ms

```typescript
// ✅ Good - Lazy loading heavy dependencies
async function buildCommand() {
  const startTime = Date.now();

  // Only import when needed
  const { heavyBuildTool } = await import('./heavy-build-tool');

  const initTime = Date.now() - startTime;
  if (initTime > 100) {
    console.warn(`Slow startup: ${initTime}ms`);
  }
}

// ❌ Bad - Loading everything upfront
import { heavyBuildTool } from './heavy-build-tool'; // Loaded immediately
```

### Startup Performance Rules

- **Lazy imports**: Use dynamic `import()` for heavy dependencies
- **Minimal bootstrap**: Keep main entry point lightweight
- **Async initialization**: Don't block startup for non-critical operations
- **Cache frequently used data**: Avoid repeated expensive computations

### Performance Monitoring

```bash
# Measure startup time
time node dist/index.js --help

# Profile memory usage
node --inspect dist/index.js command

# Bundle analysis
npm run build:analyze
```

---

## Memory Usage Standards

### ⚠️ CRITICAL: Memory usage MUST NOT exceed 50MB for typical operations

```typescript
// ✅ Good - Streaming for large files
import { createReadStream } from 'fs';
import { pipeline } from 'stream/promises';

async function processLargeFile(filePath: string) {
  const readStream = createReadStream(filePath);
  const processStream = new Transform({
    transform(chunk, encoding, callback) {
      // Process chunk by chunk, not entire file
      callback(null, processChunk(chunk));
    },
  });

  await pipeline(readStream, processStream, outputStream);
}

// ❌ Bad - Loading entire file into memory
async function processLargeFile(filePath: string) {
  const content = await readFile(filePath, 'utf8'); // Could be GBs
  return processContent(content);
}
```

### Memory Management Rules

- **Stream processing**: Use streams for large data processing
- **Chunk operations**: Process data in manageable chunks
- **Cleanup resources**: Explicitly close files, connections, timers
- **Avoid memory leaks**: Remove event listeners, clear intervals
- **Monitor heap usage**: Use `process.memoryUsage()` for diagnostics

### Memory Monitoring

```typescript
// Memory usage tracking
function logMemoryUsage(operation: string) {
  const usage = process.memoryUsage();
  const mb = (bytes: number) => Math.round(bytes / 1024 / 1024);

  console.log(`${operation}:`, {
    rss: `${mb(usage.rss)}MB`,
    heapUsed: `${mb(usage.heapUsed)}MB`,
    heapTotal: `${mb(usage.heapTotal)}MB`,
  });

  if (usage.heapUsed > 50 * 1024 * 1024) {
    // 50MB
    console.warn(`High memory usage: ${mb(usage.heapUsed)}MB`);
  }
}
```

---

## Bundle Size Standards

### ⚠️ CRITICAL: Bundle size MUST be tracked and optimized

### Bundle Size Targets

- **Main bundle**: < 1MB compressed
- **Individual modules**: < 100KB each
- **Dependencies**: Audit regularly for size impact
- **Tree shaking**: Ensure unused code is eliminated

### Bundle Optimization

```typescript
// ✅ Good - Selective imports
import { readFile } from 'fs/promises';
import { resolve } from 'path';

// ❌ Bad - Importing entire modules
import * as fs from 'fs';
import * as path from 'path';
```

### Bundle Analysis Commands

```bash
# Analyze bundle size
npm run build:analyze

# Check dependency sizes
npx bundlephobia [package-name]

# Audit bundle composition
npx webpack-bundle-analyzer dist/

# Track size over time
npm run size:check
```

### Size Monitoring Script

```json
{
  "scripts": {
    "size:check": "bundlesize",
    "size:update": "bundlesize --update-baseline"
  },
  "bundlesize": [
    {
      "path": "./dist/index.js",
      "maxSize": "1MB"
    }
  ]
}
```

---

## Runtime Performance Standards

### Response Time Requirements

- **Simple commands**: < 50ms
- **File operations**: < 200ms
- **Network operations**: < 2s with timeout
- **Complex builds**: Progress indicators required

### Performance Best Practices

```typescript
// ✅ Good - Efficient algorithms
function findItem(items: Item[], id: string): Item | undefined {
  // Use Map for O(1) lookup instead of O(n) array search
  const itemMap = new Map(items.map(item => [item.id, item]));
  return itemMap.get(id);
}

// ✅ Good - Caching expensive operations
const configCache = new Map<string, Config>();

function getConfig(path: string): Config {
  if (configCache.has(path)) {
    return configCache.get(path)!;
  }

  const config = parseConfig(path);
  configCache.set(path, config);
  return config;
}

// ✅ Good - Parallel processing
async function processFiles(filePaths: string[]) {
  // Process files in parallel, not sequentially
  const results = await Promise.all(filePaths.map(path => processFile(path)));
  return results;
}
```

---

## Performance Testing

### Benchmarking

```typescript
// Performance test example
describe('Performance Tests', () => {
  it('should start CLI within 100ms', async () => {
    const startTime = Date.now();

    await import('../src/index');

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(100);
  });

  it('should process 1000 items within 1 second', async () => {
    const items = generateTestItems(1000);
    const startTime = Date.now();

    await processItems(items);

    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(1000);
  });
});
```

### Performance Monitoring in CI

```yaml
# .github/workflows/performance.yml
- name: Performance Tests
  run: |
    npm run test:performance
    npm run size:check

- name: Memory Usage Check
  run: |
    node --max-old-space-size=64 dist/index.js --help
```

---

## Performance Regression Prevention

### Automated Checks

- **Bundle size limits**: Fail CI if bundle grows unexpectedly
- **Memory usage tests**: Automated tests for memory consumption
- **Startup time tests**: Verify CLI starts within time limits
- **Performance benchmarks**: Track key operations over time

### Performance Budget

```json
{
  "performance": {
    "budgets": [
      {
        "type": "bundle",
        "name": "main",
        "baseline": "1MB",
        "maximumWarning": "1.2MB",
        "maximumError": "1.5MB"
      },
      {
        "type": "initial",
        "name": "startup",
        "baseline": "100ms",
        "maximumWarning": "150ms",
        "maximumError": "200ms"
      }
    ]
  }
}
```

### Monitoring Commands

```bash
# Regular performance checks
npm run perf:startup    # Measure startup time
npm run perf:memory     # Check memory usage
npm run perf:bundle     # Analyze bundle size
npm run perf:benchmark  # Run performance benchmarks
```
