const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack-common");

const configuration = merge(common, {
    mode: "development",
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        host: "0.0.0.0",
        port: 9001,
        historyApiFallback: true,
        writeToDisk: true,
        hot: true,
    },
});

module.exports = configuration;
