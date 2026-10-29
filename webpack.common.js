const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'docs')
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { plugins: [['postcss-preset-env']] } }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/i,
        type: 'asset/resource',
        generator: { filename: 'images/[name][ext]' }
      },
      {
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',
        generator: { filename: 'fonts/[name][ext]' }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),

    new CopyPlugin({
      patterns: [
        { from: 'src/share', to: 'share' },
        { from: 'src/CNAME', to: 'CNAME', noErrorOnMissing: true }
      ]
    }),

    // Лонгрид
    new HtmlWebpackPlugin({
      hash: true,
      scriptLoading: 'blocking',
      template: './src/index.html',
      filename: './index.html',
      chunks: ['index']
    }),

    // 404 (GitHub Pages отдаёт её сам)
    new HtmlWebpackPlugin({
      template: './src/404.html',
      filename: './404.html',
      chunks: ['index']
    }),

    // Partials
    new HtmlWebpackPartialsPlugin([
      {
        path: path.join(__dirname, './src/partials/analytics.html'),
        location: 'analytics',
        template_filename: '*',
        priority: 'replace'
      }
    ])
  ],
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()]
  }
}
