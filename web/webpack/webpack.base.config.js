const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const nodeExternals = require('webpack-node-externals')
const pjson = require('../package.json')

const node_env = process.env.NODE_ENV || 'development';

const node_production = node_env === 'production';

const commonConfig = {
  target: 'web',
  devtool: 'source-map',

  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: `ts-loader`
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          //fallback: 'style-loader',
          use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: `[local]___[hash:base64:5]___${pjson.name}`,
                importLoaders: 2
              }
            },
            {
              loader: 'typed-css-modules-loader?noEmit'
            },
            //{
            //loader: 'typings-for-css-modules-loader?modules&namedExport&camelCase'
            //},
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => [
                  require('postcss-for'),
                  require('postcss-simple-vars'),
                  require('postcss-custom-properties'),
                  require('postcss-nested'),
                  require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie >= 9']
                  }),
                  require('lost'),
                  require('postcss-ant')
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        use: [
          'file-loader',
        ]
      },
      {
        test: /\.json$/,
        use: [
          'json-loader'
        ]
      }

    ]
  },

  resolve: {
    modules: [
      path.join(__dirname, '../src'),
      'node_modules'
    ],
    extensions: ['.ts', '.tsx', '.js'],
    mainFields: ['browser', 'main', 'module'],
  }
};

const vendor = Object.assign({}, commonConfig, {
  entry: {
    vendor: ['react', 'react-dom', 'moment']
  },
  output: {
    filename: node_production ? 'vendor_[hash].js' : 'vendor.js',
    path: path.resolve(__dirname, '../dist/public'),
    library: 'vendor',
    libraryTarget: 'umd',
  },
  plugins: [].concat(
    new AssetsPlugin({
      filename: 'dist/vendormeta.json'
    }),
    new webpack.DllPlugin({
      name: node_production ? 'vendor_[hash]' : 'vendor',
      path: path.resolve(__dirname, "../dist/vendor-dll-manifest.json"),
    }),
    node_production ? [new UglifyJSPlugin({
      sourceMap: false
    })] : [],
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(node_env)
      }
    })
  )
})

const site = (options) => Object.assign({}, commonConfig, {
  entry: {
    site: './src/site/index.tsx'
  },
  output: {
    filename: node_production ? 'site_[hash].js' : 'site.js',
    path: path.resolve(__dirname, '../dist/public')
  },
  plugins: [].concat(
    new AssetsPlugin({
      filename: 'dist/sitemeta.json'
    }),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: options.vendordll,
    }),
    new ExtractTextPlugin(node_production ? 'site_[hash].css' : 'site.css'),
    node_production ? [
      new UglifyJSPlugin({
        sourceMap: false
      })
    ] : [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
        statsFilename: '../sitestats.json'
      })
    ],
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../public'),
      to: path.join(__dirname, '../dist/public')
    }])
  )
})

const app = (options) => Object.assign({}, commonConfig, {
  entry: {
    app: './src/app/index.tsx'
  },
  output: {
    filename: node_production ? 'app_[hash].js' : 'app.js',
    path: path.resolve(__dirname, '../dist/public')
  },
  plugins: [].concat(
    new AssetsPlugin({
      filename: 'dist/appmeta.json'
    }),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: options.vendordll,
    }),
    new ExtractTextPlugin(node_production ? 'app_[hash].css' : 'app.css'),
    node_production ? [
      new UglifyJSPlugin({
        sourceMap: false
      })
    ] : [
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        generateStatsFile: true,
        statsFilename: '../appstats.json'
      })
    ]
  )
})

const sitessr = (options) => Object.assign({}, commonConfig, {
  entry: {
    sitessr: './src/site/index.ssr.tsx'
  },
  output: {
    filename: node_production ? 'sitessr_[hash].js' : 'sitessr.js',
    path: path.resolve(__dirname, '../dist/public'),
    libraryTarget: 'umd'
  },
  plugins: [].concat(
    new StaticSiteGeneratorPlugin({
      locals: {
        node_env,
        env: process.env,
        //vendormeta: options.vendormeta,
        //sitemeta: options.sitemeta,
      }
    }),
    new ExtractTextPlugin(node_production ? 'sitessr_[hash].css' : 'sitessr.css')
  )
})

module.exports = {
  vendor,
  site,
  app,
  sitessr
}
