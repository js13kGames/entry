const path = require('path');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|gif|jpg|svg)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new ZipPlugin()
  ]
};
