export const ENV_CONFIG = {
  // Set to true to use mock data instead of Firebase
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || import.meta.env.NODE_ENV === 'development',
  
  // Mock data settings
  MOCK_DATA_DELAY: parseInt(import.meta.env.VITE_MOCK_DATA_DELAY || '500'), // ms
  
  // Firebase settings
  FIREBASE_ENABLED: import.meta.env.VITE_FIREBASE_ENABLED !== 'false',
  
  // Development settings
  DEBUG_MODE: import.meta.env.NODE_ENV === 'development',
  
  // API settings
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
};

// Helper function to log configuration
export const logConfig = () => {
  if (ENV_CONFIG.DEBUG_MODE) {
    console.log('Environment Configuration:', {
      USE_MOCK_DATA: ENV_CONFIG.USE_MOCK_DATA,
      MOCK_DATA_DELAY: ENV_CONFIG.MOCK_DATA_DELAY,
      FIREBASE_ENABLED: ENV_CONFIG.FIREBASE_ENABLED,
      DEBUG_MODE: ENV_CONFIG.DEBUG_MODE,
    });
  }
};

// Initialize configuration logging
logConfig();
