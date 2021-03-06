/**
 * THIS CONFIG FOR OUR EXAMPLE, CONSUMING APP
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const WARN_APICLIENT = 'OpenLaw APIClient: Please authenticate if you wish to use the Address input.';

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    example: './example/index'
  },
  mode: 'development',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'static/[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.OPENLAW_EMAIL': JSON.stringify(process.env.OPENLAW_EMAIL),
      'process.env.OPENLAW_INSTANCE_NAME': JSON.stringify(process.env.OPENLAW_INSTANCE_NAME),
      'process.env.OPENLAW_PASSWORD': JSON.stringify(process.env.OPENLAW_PASSWORD),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './example/index.html',
      warningApiClient: !process.env.OPENLAW_EMAIL || !process.env.OPENLAW_PASSWORD ? WARN_APICLIENT : '',
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        // ignore node_modules and local openlaw (when using `npm/yarn link`)
        exclude: [
          /node_modules/,
          new RegExp(path.resolve(__dirname, '../openlaw-client/dist/esm/lib/openlaw.js')),
        ],
      }, {
        test: /\.css$/,
        // style-loader injects the styles into the <head>
        // css-loader handles the import
        use: ['style-loader', 'css-loader'],
      }, {
       test: /\.scss$/,
       use: ['style-loader', 'css-loader', 'sass-loader'],
     },
    ]
  },
  devServer: {
    contentBase: 'build',
    port: 3001
  },
};
