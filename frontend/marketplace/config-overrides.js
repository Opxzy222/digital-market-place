module.exports = function override(config, env) {
    config.watchOptions = {
      ignored: /node_modules|\.git|\/mnt\/c\/pagefile\.sys/,
      poll: 1000,
    };
    return config;
  };
  