import "regenerator-runtime";
import "assets/tailwind.css";
import "assets/global-styles.scss";
import "element-plus/theme-chalk/index.css";
import "@fortawesome/fontawesome-free/js/all";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoReplaceSvg = "nest";

import { createApp } from "vue";
import DescriboCrateBuilder from "@describo/crate-builder-component";
import VueScrollTo from "vue-scrollto";
import App from "./App.vue";
import { router } from "./routes.js";
import { store } from "./store.js";
import ElementPlus from "element-plus";
import log from "loglevel";
import prefix from "loglevel-plugin-prefix";
const level = process.env.NODE_ENV === "development" ? "debug" : "warn";
log.setLevel(level);
const prefixer = prefix.noConflict();
prefixer.reg(log);
prefixer.apply(log);
// import { io } from "socket.io-client";
import HTTPService from "./http.service";

(async () => {
    let response = await fetch("/api/configuration");
    if (response.status === 200) {
        let configuration = await response.json();
        store.commit("saveConfiguration", { ...configuration });
        const app = createApp(App);
        app.use(store);
        app.use(router({ configuration }));
        app.use(ElementPlus);
        app.use(DescriboCrateBuilder);
        app.use(VueScrollTo);
        app.config.globalProperties.$http = new HTTPService({ router });
        app.provide("$http", app.config.globalProperties.$http);
        app.config.globalProperties.$log = log;
        app.provide("$log", app.config.globalProperties.$log);
        app.mount("#app");
    }
})();

//     Vue.use(VueAnalytics, {
//         id: "UA-79571514-3",
//         debug: {
//             sendHitTask: process.env.NODE_ENV === "production",
//         },
//         router: App.router,
//     });
