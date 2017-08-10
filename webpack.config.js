// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const webpack = require('webpack');

module.exports = {

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'eval-source-map',

  entry: "./src/entry.ts",
  output: {
    filename: './dist/bundle.js'
  },

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'tslint-loader',
        enforce: 'pre',
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
      }
    ],
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: false,
          failOnHint: false
        }
      }
    }),
  ],

  // Disable performance hassle
  performance: { hints: false }

};