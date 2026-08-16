// SSDK Enterprise Health Monitor
// Monitors System Resources, Core Web Vitals, and API Latency

export class HealthMonitor {
  constructor() {
    this.core = null;
    this.metrics = {
      lcp: null,
      fid: null,
      cls: null,
      ttfb: null,
      apiLatency: [],
      memory: null
    };
    this.isEnabled = true;
  }

  async init(core) {
    this.core = core;
    
    if (this.core.getEngine("logger")) {
      this.core.getEngine("logger").info("HealthMonitor", "Initializing Performance Tracking");
    }

    if (this.isEnabled && typeof window !== "undefined") {
      this.observeVitals();
      this.observeMemory();
      
      // Periodically report health
      setInterval(() => {
        this.reportHealth();
      }, 60000); // every minute
    }
  }

  observeVitals() {
    if (!('PerformanceObserver' in window)) return;

    // Largest Contentful Paint (LCP)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}

    // First Input Delay (FID)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      }).observe({ type: 'first-input', buffered: true });
    } catch (e) {}

    // Cumulative Layout Shift (CLS)
    try {
      new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}

    // Time to First Byte (TTFB)
    try {
      new PerformanceObserver((entryList) => {
        const [pageNav] = entryList.getEntriesByType('navigation');
        this.metrics.ttfb = pageNav.responseStart;
      }).observe({ type: 'navigation', buffered: true });
    } catch (e) {}
  }

  observeMemory() {
    if (performance && performance.memory) {
      setInterval(() => {
        this.metrics.memory = {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
      }, 30000);
    }
  }

  recordApiLatency(endpoint, durationMs) {
    this.metrics.apiLatency.push({ endpoint, duration: durationMs, ts: Date.now() });
    // Keep only last 100 entries to prevent memory leak
    if (this.metrics.apiLatency.length > 100) {
      this.metrics.apiLatency.shift();
    }
  }

  reportHealth() {
    const logger = this.core.getEngine("logger");
    if (!logger) return;

    logger.debug("HealthMonitor", "System Health Snapshot", {
      vitals: {
        LCP: this.metrics.lcp,
        FID: this.metrics.fid,
        CLS: this.metrics.cls,
        TTFB: this.metrics.ttfb
      },
      memory: this.metrics.memory,
      apiLatencyCount: this.metrics.apiLatency.length
    });
  }

  getDashboardData() {
    return { ...this.metrics, timestamp: Date.now() };
  }
}
