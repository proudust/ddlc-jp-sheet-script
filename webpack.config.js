const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
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
      {
        test: /\.html?$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: false,
            collapseWhitespace: false,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/uploder.html', filename: 'uploder.html' }),
    new GasPlugin(),
  ],
};
