const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.pug'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: "public", to: ""}
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'inline-source-map'
        config.devServer = {
            port: 3000,
            static: './dist',
        }
        config.optimization = {
            runtimeChunk: 'single'
        }
        config.module.rules.push({
            test: /\.(sa|sc|c)ss$/i,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader",
            ],
        })
    }
    if (argv.mode === 'production') {
        config.plugins.push(new MiniCssExtractPlugin())
        config.module.rules.push({
            test: /\.(sa|sc|c)ss$/i,
            use: [
                MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader",
            ],
        })
    }
    return config;
}