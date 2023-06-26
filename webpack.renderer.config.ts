import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

const path = require('path');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@images': path.resolve(__dirname, './src/images'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@context': path.resolve(__dirname, './src/context'),
      '@src-back': path.resolve(__dirname, './src/src-back'),
      '@': path.resolve(__dirname, './src'),
      "@component": path.resolve(__dirname, './src/components'),
      "@config-expert-setup": path.resolve(__dirname, './src/configuration/expert-setup'),
      "@wallet": path.resolve(__dirname, './src/configuration/modules/wallet'),
      "@hooks":  path.resolve(__dirname, './src/hooks')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    fallback: {
      path: require.resolve('path-browserify')
    }
  },
};
