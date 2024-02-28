const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
    const config = {
        mode: 'development',
        entry: './src/index.js',
        devtool: 'inline-source-map',
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Super Poker',
                favicon: 'favicon.ico',
            }),
            new DefinePlugin({
                'SERVER_URL': JSON.stringify(process.env.SERVER_URL),
                'BASE_URL': JSON.stringify(process.env.BASE_URL),
            }),
            new CopyPlugin({
                patterns: [
                    'config.json',
                ],
            }),
        ],
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
            ],
        },
    };

    if (env.production) {
        config.mode = 'production';
        config.devtool = false;
        config.performance = {
            maxEntrypointSize: 2 ** 20,
            maxAssetSize: 2 ** 20,
        };
        config.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            drop_console: true
                        },
                    },
                }),
            ],
        };
    }

    return config;
}
