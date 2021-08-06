import FileManagerPlugin from 'filemanager-webpack-plugin';
import GasPlugin from 'gas-webpack-plugin';
import path from 'path';
import type { Configuration } from 'webpack';

const config: Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: false,
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  plugins: [
    new GasPlugin(),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [{ source: 'src/appsscript.json', destination: 'dist/' }],
        },
      },
    }),
  ],
};

export default config;
