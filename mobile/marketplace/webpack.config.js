const createExpoWebpackConfigAsync = require('@expo/webpack-config'); // Correct the import
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = async function (env, argv) {
    const config = await createExpoWebpackConfigAsync(env, argv);

    // Add polyfills for crypto and stream
    config.plugins.push(new NodePolyfillPlugin());

    config.plugins.forEach((plugin) => {
        if (plugin.constructor.name === 'DefinePlugin') {
            plugin.definitions['process.env.EXPO_ROUTER_APP_ROOT'] = JSON.stringify('/src/app');
        }
    });

    return config;
};
