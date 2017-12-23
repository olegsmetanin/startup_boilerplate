const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const IndexPlugin = require('./webpack/indexplugin')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')

const node_env = process.env.NODE_ENV || 'development';

const node_production = node_env === 'production';

const commonConfig = {
    target: 'web',
    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: `ts-loader`
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
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
            path.join(__dirname, 'src'),
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
        path: path.resolve(__dirname, 'dist/public'),
        library: 'vendor',
        libraryTarget: 'umd',
    },
    plugins: [].concat(
        new AssetsPlugin({filename: 'dist/vendormeta.json'}),
        new webpack.DllPlugin({
            name: node_production ? 'vendor_[hash]' : 'vendor',
            path: path.resolve(__dirname, "dist/vendor-dll-manifest.json"),
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
        path: path.resolve(__dirname, 'dist/public')
    },
    plugins: [].concat(
        new AssetsPlugin({filename: 'dist/sitemeta.json'}),
        new webpack.DllReferencePlugin({
            context: '.',
            manifest: options.vendordll,
        }),
        node_production ? [
            new UglifyJSPlugin({
                sourceMap: false
            })
        ] : [
            new BundleAnalyzerPlugin({analyzerMode: 'disabled', generateStatsFile: true, statsFilename: '../sitestats.json'})
        ],
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src/public'),
                to: path.join(__dirname, 'dist/public')
            }
        ])
    )
})

const sitessr = (options) => Object.assign({}, commonConfig, {
    entry: {
        sitessr: './src/sitessr/index.tsx'
    },
    output: {
        filename: node_production ? 'sitessr_[hash].js' : 'sitessr.js',
        path: path.resolve(__dirname, 'dist/public'),
        libraryTarget: 'umd'
    },
    plugins: [].concat(
        new StaticSiteGeneratorPlugin({
            locals: {
                node_env,
                vendormeta: options.vendormeta,
                sitemeta: options.sitemeta,
            }
        })
    )
})

module.exports = {
    vendor,
    site,
    sitessr
}

