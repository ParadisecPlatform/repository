module.exports = {
    presets: [["@babel/preset-env"]],
    plugins: [
        [
            "prismjs",
            {
                languages: ["xml", "javascript", "css", "markup"],
                plugins: ["line-numbers"],
                theme: "okaidia",
                css: true,
            },
        ],
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-optional-chaining",
    ],
};
