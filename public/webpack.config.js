const path = require('path')
const webpack = require('webpack')
const WebpackNotifier = require('webpack-notifier')

const config = {
  entry: {
    index: './entry/index',
    admin: './entry/admin'
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    // 配置vue单页面需要
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      },
      {
        test: /\.art$/,
        loader: 'art-template-loader'
      }
    ]
  },
  plugins: [
    new WebpackNotifier({ alwaysNotify: true }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
}

module.exports = config
