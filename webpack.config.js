const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const base = require('./webpack.config.base')

module.exports = merge(base, {
  // mode: process.env.NODE_ENV || 'production',
  mode: "development",
  devtool: 'source-map',
  output: {
    filename: '[name].bundle.js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 20480,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

  ],

  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    'antd': 'antd',
    '@ant-design/icons': 'icons',
    // 'cheerio': 'window',
    // "cheerio": "Cheerio",
    // "react-native-cheerio": "window",
    // 'jquery': 'jQuery',
  },

//   resolve: {
//     fallback: {
//       util: require.resolve("util/")
//     }
// },

})
