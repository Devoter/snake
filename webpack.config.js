const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const prodMode = process.env.NODE_ENV === 'production';

let config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        snake: './js/main.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        // publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: prodMode ? { minimize: true } : {}
                        },
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]'
                }
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ],
        loaders: [
            {
                test: /\.html$/,
                loader: ['file-loader', 'html-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: ['file-loader'],
                options: {
                    name: 'img/[name].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: ['file-loader'],
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.scss$/,
                loader: 'css-loader!sass-loader',
            }
        ]
    },
    plugins: [
    new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({ template: './index.html' }),
        new ExtractTextPlugin('style.css'),
        new CopyWebpackPlugin([
            {
                from: './img',
                to: 'img'
            }
        ])
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'src')
    },

    devtool: prodMode ? 'source-map' : 'eval-source-map'
};

module.exports = config;
