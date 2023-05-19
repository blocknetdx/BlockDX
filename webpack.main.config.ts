import type { Configuration } from 'webpack';

const path = require('path');

import { rules } from './webpack.rules';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@images': path.resolve(__dirname, './src/images'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@context': path.resolve(__dirname, './src/context'),
      '@src-back': path.resolve(__dirname, './src/src-back'),
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    fallback: {
      path: require.resolve('path-browserify')
    }
  },
};
