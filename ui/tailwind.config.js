module.exports = {
    future: {},
    mode: "jit",
    content: [
        "./public/index.html",
        "./src/**/*.html",
        "./src/**/*.{js,jsx,ts,tsx,vue}",
        "./node_modules/@describo/**/*.vue",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1f3a93",
                highlight: "#f9690e",
            },
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            xxl: "1600px",
        },
    },
    variants: {},
    plugins: [require("@tailwindcss/typography")],
};
