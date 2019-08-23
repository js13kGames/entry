var path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devConfig = {
  mode: 'development',
  entry: [
    path.resolve(__dirname, 'src') + '/devboot.js'
  ],
  devServer: {
    hot: true,
    inline: true,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  output: {
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'Tetris',
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        use: 'file-loader'
      },
      {
        test: /\.(frag?g|vert)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'head'
    }),
    new webpack.HotModuleReplacementPlugin({})
  ]
};

const prodConfig = {
  entry: [
    path.resolve(__dirname, 'src') + '/boot.js'
  ],
  mode: 'production',
  output: {
    filename: 'bundle.js',
    libraryTarget: 'var',
    library: 'Tetris',
  },
  devtool: 'none',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        use: 'file-loader'
      },
      {
        test: /\.(frag?g|vert)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.css?$/,
        use: [{loader: MiniCssExtractPlugin.loader, options: {}}, 'css-loader'],
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'head'
    }),
    new MiniCssExtractPlugin({})
  ]
};

module.exports = (env) => {
  switch (env) {
  case 'production':
    return prodConfig;
  default:
    return devConfig;
  }
};
