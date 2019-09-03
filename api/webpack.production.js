"use strict";

const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const targetPath = `${__dirname}/dist`;

module.exports = {
    entry: "./index.js",
    target: "node",
    mode: "production",
    devtool: "source-map",
    output: {
        path: targetPath,
        filename: "index.js"
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: false,
            cleanOnceBeforeBuildPatterns: ["**/*", "!node_modules"]
        }),
        new webpack.DefinePlugin({ "global.GENTLY": false }),
        new CopyWebpackPlugin(
            [
                { from: "package.json", to: targetPath },
                { from: "package-lock.json", to: targetPath },
                {
                    from: "src/common/mailer/templates/",
                    to: `${targetPath}/templates`,
                    toType: "dir"
                }
            ],
            {}
        )
    ],
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            src: path.resolve(__dirname, "src")
        }
    }
};
