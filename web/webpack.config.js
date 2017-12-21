const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const node_env = process.env.NODE_ENV || 'development';

const node_production = node_env === 'production';

console.log('Build:', node_env)

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
        filename: 'vendor_[hash].js',
        path: path.resolve(__dirname, 'dist/static')
    },
    plugins: [].concat(
        new AssetsPlugin({filename: 'dist/vendorassets.json'}),
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

const site = Object.assign({}, commonConfig, {
    entry: {
        site: './src/site/index.tsx'
    },
    output: {
        filename: 'site_[hash].js',
        path: path.resolve(__dirname, 'dist/static')
    },
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom'
        }
    },
    plugins: [].concat(
        new AssetsPlugin({filename: 'dist/siteassets.json'}),
        node_production ? [new UglifyJSPlugin({
            sourceMap: false
        })] : [],
        new CopyWebpackPlugin([
            {
                from: path.join(__dirname, 'src/public'),
                to: path.join(__dirname, 'dist')
            }
        ])
    )
})

module.exports = [
    vendor,
    site
]

