// Centralized configuration
export const appConfig = {
    // API Configuration
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
        timeout: 30000,
        useMockData: process.env.NODE_ENV === 'development', // Auto-detect
    },

    // Feature flags
    features: {
        enableRealTimeUpdates: false,
        enableAdvancedFilters: true,
        enableDataExport: true,
    },

    // UI Configuration
    ui: {
        itemsPerPage: 10,
        enableAnimations: true,
        theme: 'bootstrap',
    }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'production') {
    appConfig.api.useMockData = false;
    appConfig.features.enableRealTimeUpdates = true;
}

// Development overrides
if (process.env.NODE_ENV === 'development') {
    appConfig.api.useMockData = true;
    appConfig.ui.enableAnimations = false; // Faster development
}

export default appConfig;
