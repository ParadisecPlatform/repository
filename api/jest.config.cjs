module.exports = {
    verbose: true,
    roots: ["src"],
    testMatch: ["**/*.spec.js"],
    testPathIgnorePatterns: ["node_modules"],
    watchPathIgnorePatterns: ["\\**/.*(?<!spec).js"],
    transform: {
        "\\.[jt]sx?$": "babel-jest",
    },
};
