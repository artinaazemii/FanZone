// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const config = getDefaultConfig(__dirname);

// Support any .cjs modules from Firebase
config.resolver.sourceExts.push('cjs');

// Disable strict "exports" so Metro falls back to the React-Native entrypoint
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
