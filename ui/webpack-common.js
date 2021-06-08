"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

module.exports = {
    target: "web",
    entry: ["./src/vendor.js", "./src/index.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[contenthash].js",
        publicPath: "/",
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["*.js", "*.css", "*.txt"],
        }),
        new HtmlWebpackPlugin({
            title: "OCFL Repository Viewer",
            template: "./src/index.html",
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({ filename: "[contenthash].css" }),
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
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "",
                        },
                    },
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "",
                        },
                    },
                    "css-loader",
                    "postcss-loader",
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg|png|jp(e*)g|gif|mp4)?$/,
                loader: "file-loader",
                options: {
                    name: "assets/[contenthash].[ext]",
                    esModule: false,
                },
            },
            {
                test: /\.worker\.js$/,
                use: { loader: "worker-loader" },
            },
        ],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            src: path.resolve(__dirname, "src"),
            assets: path.resolve(__dirname, "src/assets"),
            components: path.resolve(__dirname, "src/components"),
        },
    },
};
