'use strict';

/**
 * Default dev server configuration.
 */
const webpack = require('webpack');
const WebpackBaseConfig = require('./Base');

class WebpackDevConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      devtool: 'cheap-module-source-map',
      entry: [
        'webpack-dev-server/client?:8000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './client.js'
      ],
      plugins: [
        new webpack.DefinePlugin({
            BASE_API_URL: JSON.stringify(process.env.BASE_API_URL || "http://localhost:5000/api")
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
      ]
    };
  }
}

module.exports = WebpackDevConfig;
