const path = require('path');
const GasPlugin = require('gas-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  mode: 'development',
  entry: {
    client: './src/client/uploder.ts',
    server: './src/index.ts',
  },
  devtool: false,
  output: {
    filename: '[name].js',
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
    new HtmlWebpackPlugin({
      template: './src/client/uploder.html',
      filename: 'uploder.html',
      inlineSource: '.(js)$',
      chunks: ['client'],
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new GasPlugin(),
  ],
};
