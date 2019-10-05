module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current"
                }
            }
        ]
    ],
    plugins: [
        [
            "prismjs",
            {
                languages: ["xml", "javascript", "css", "markup"],
                plugins: ["line-numbers"],
                theme: "okaidia",
                css: true
            }
        ]
    ]
};
