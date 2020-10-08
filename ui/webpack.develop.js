"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

module.exports = {
    target: "web",
    mode: "development",
    devtool: "eval-source-map",
    entry: ["./src/vendor.js", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[hash].bundle.js",
        globalObject: "this",
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "all",
                },
            },
        },
    },
    watch: true,
    watchOptions: {
        poll: 1000,
        ignored: ["git", "node_modules"],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        host: "0.0.0.0",
        port: 9001,
        historyApiFallback: true,
        // watchOptions: {
        //     watch: true,
        //     poll: 1000,
        //     ignored: ["node_modules", "dist"],
        // },
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development"),
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["dist/*.js", "dist/*.css"],
        }),
        new HtmlWebpackPlugin({
            title: "OCFL Repository Viewer",
            template: "./src/index.html",
        }),
        new VueLoaderPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./src/configuration.json",
                    to: "configuration.json",
                },
                {
                    from: "./jsonldcontext.jsonld",
                    to: "jsonldcontext.jsonld",
                },
                {
                    from: "src/assets/images",
                    to: "assets/images",
                },
            ],
        }),
        new ImageminPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: "95-100",
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                query: { compact: false },
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    "vue-style-loader",
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    "postcss-loader",
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg|png|jp(e*)g|gif)?$/,
                loader: "file-loader?name=res/[name].[ext]?[hash]",
            },
            {
                test: /\.worker\.js$/,
                use: { loader: "worker-loader" },
            },
        ],
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src"),
            assets: path.resolve(__dirname, "src/assets"),
            components: path.resolve(__dirname, "src/components"),
            configuration: path.resolve(__dirname, "src/configuration"),
            directives: path.resolve(__dirname, "src/directives"),
            routes: path.resolve(__dirname, "src/routes/"),
            services: path.resolve(__dirname, "src/services"),
            store: path.resolve(__dirname, "src/store"),
        },
    },
};
