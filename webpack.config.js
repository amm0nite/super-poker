const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = (env) => {
    const config = {
        mode: 'development',
        entry: './src/index.js',
        devtool: 'inline-source-map',
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: 'Super Poker',
            }),
            new DefinePlugin({
                'SERVER_URL': JSON.stringify(process.env.SERVER_URL)
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
        performance: {
            maxEntrypointSize: 2 ** 20,
            maxAssetSize: 2 ** 20,
        },
    }

    if (env.production) {
        config.mode = 'production';
        config.devtool = false;
    }

    return config;
}
