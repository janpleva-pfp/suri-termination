/* eslint-disable no-console */
type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug' | 'trace';

interface Logger {
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  debug: (...args: any[]) => void;
  trace: (...args: any[]) => void;
  group: (...args: any[]) => void;
  groupCollapsed: (...args: any[]) => void;
  groupEnd: () => void;
  table: (data: any) => void;
  time: (label?: string) => void;
  timeEnd: (label?: string) => void;
  clear: () => void;
}

class DevLogger implements Logger {
  private isDev: boolean;

  constructor() {
    // Check if we're in development mode
    this.isDev = ['development', 'test'].includes(process.env.CONTENT_ENV || 'production');
  }

  private shouldLog(): boolean {
    return this.isDev && typeof console !== 'undefined';
  }

  log(...args: any[]): void {
    if (this.shouldLog()) {
      console.log(...args);
    }
  }

  info(...args: any[]): void {
    if (this.shouldLog()) {
      console.info(...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog()) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog()) {
      console.error(...args);
    }
  }

  debug(...args: any[]): void {
    if (this.shouldLog()) {
      console.debug(...args);
    }
  }

  trace(...args: any[]): void {
    if (this.shouldLog()) {
      console.trace(...args);
    }
  }

  group(...args: any[]): void {
    if (this.shouldLog()) {
      console.group(...args);
    }
  }

  groupCollapsed(...args: any[]): void {
    if (this.shouldLog()) {
      console.groupCollapsed(...args);
    }
  }

  groupEnd(): void {
    if (this.shouldLog()) {
      console.groupEnd();
    }
  }

  table(data: any): void {
    if (this.shouldLog()) {
      console.table(data);
    }
  }

  time(label?: string): void {
    if (this.shouldLog()) {
      console.time(label);
    }
  }

  timeEnd(label?: string): void {
    if (this.shouldLog()) {
      console.timeEnd(label);
    }
  }

  clear(): void {
    if (this.shouldLog()) {
      console.clear();
    }
  }
}

// Create singleton instance
const devlogger = new DevLogger();

export default devlogger;

export const logObjectOneLevel = function (originalObject: Record<string, any> | null): Record<string, any> {
  const oneLevelObject: Record<string, any> = {};

  for (const key in originalObject) {
    if (originalObject.hasOwnProperty(key)) {
      const value = originalObject[key];
      const valueType = typeof value;
      if (valueType === 'object' && value !== null) {
        if (Array.isArray(value)) {
          oneLevelObject[key] = '[object Array]';
        } else {
          oneLevelObject[key] = '[object Object]';
        }
      } else {
        oneLevelObject[key] = value;
      }
    }
  }
  return oneLevelObject;
};
