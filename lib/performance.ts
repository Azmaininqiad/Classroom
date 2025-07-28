// Performance monitoring utilities for the welcome page

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionTime: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private startTime: number;
  private renderStartTime: number;
  private metrics: Partial<PerformanceMetrics> = {};

  constructor() {
    this.startTime = performance.now();
    this.renderStartTime = performance.now();
  }

  markRenderComplete() {
    this.metrics.renderTime = performance.now() - this.renderStartTime;
  }

  markLoadComplete() {
    this.metrics.loadTime = performance.now() - this.startTime;
  }

  markInteraction(interactionName: string) {
    const interactionTime = performance.now() - this.startTime;
    this.metrics.interactionTime = interactionTime;
    
    // Log interaction for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${interactionName} interaction time:`, interactionTime, 'ms');
    }
  }

  getMetrics(): PerformanceMetrics {
    // Get memory usage if available
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory?.usedJSHeapSize;
    }

    return {
      loadTime: this.metrics.loadTime || 0,
      renderTime: this.metrics.renderTime || 0,
      interactionTime: this.metrics.interactionTime || 0,
      memoryUsage: this.metrics.memoryUsage
    };
  }

  logMetrics() {
    if (process.env.NODE_ENV === 'development') {
      const metrics = this.getMetrics();
      console.group('Welcome Page Performance Metrics');
      console.log('Load Time:', metrics.loadTime.toFixed(2), 'ms');
      console.log('Render Time:', metrics.renderTime.toFixed(2), 'ms');
      console.log('Last Interaction Time:', metrics.interactionTime.toFixed(2), 'ms');
      if (metrics.memoryUsage) {
        console.log('Memory Usage:', (metrics.memoryUsage / 1024 / 1024).toFixed(2), 'MB');
      }
      console.groupEnd();
    }
  }

  // Core Web Vitals monitoring
  measureCoreWebVitals() {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (process.env.NODE_ENV === 'development') {
            console.log('LCP:', lastEntry.startTime.toFixed(2), 'ms');
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('FID:', (entry as any).processingStart - entry.startTime, 'ms');
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          });
          if (process.env.NODE_ENV === 'development') {
            console.log('CLS:', clsValue.toFixed(4));
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }
}

export const createPerformanceMonitor = () => new PerformanceMonitor();

// Utility function to measure component render time
export const measureRenderTime = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time:`, (endTime - startTime).toFixed(2), 'ms');
    }
  };
};

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};