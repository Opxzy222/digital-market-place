const { getDefaultConfig } = require('@expo/metro-config');

// Use dynamic import for ES module compatibility
(async () => {
  global.fetch = (await import('node-fetch')).default;
})();

// Get the default config
const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
    // Spread the default config
    ...defaultConfig,
    resolver: {
        ...defaultConfig.resolver,
        // Define the source file extensions you want to support
        sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs'],  
        // Add any custom asset extensions if needed
        assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), // if you want to exclude svg
    },
    transformer: {
        // This is optional, add any custom transformer configurations here
    },
};
