declare global {
  interface Window {
    devlogger: any;
  }

  // Make logger available globally in development (both browser and Node.js)
  declare var devlogger: any;

  namespace NodeJS {
    interface Global {
      devlogger: any;
    }
  }
}

export {};
