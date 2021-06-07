const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[fullhash].${ext}`

const isLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          {
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        ],
      }
    }
  ]

  // if(isDev) {
  //   loaders.push('eslint-loader')
  // }
  return loaders
}

console.log('PROD', isProd);
console.log('DEV', isDev);

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['./index.js'],
  output: {
    filename: filename('js'),
    clean: true,
    path: path.resolve(__dirname, 'dist')
  },
  target: 'web',
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core')
    }
  },
  devtool: isDev ? 'source-map' : false,
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'src/favicon.ico'), 
          to: path.resolve(__dirname, 'dist'),
        }
      ],
    }),
    new MiniCssExtractPlugin({
      filename: filename('css')
    }),
    new ESLintPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: isLoaders()
      }
    ],
  },
  devServer: {
    port: 3000,
    hot: isDev
  }
}