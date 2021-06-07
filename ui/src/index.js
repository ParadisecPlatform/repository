"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "assets/global-styles.scss";

import Vue from "vue";

import "element-ui/lib/theme-chalk/index.css";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
Vue.use(ElementUI, { locale });

import VueScrollTo from "vue-scrollto";
Vue.use(VueScrollTo);

import VueAnalytics from "vue-analytics";

import App from "components/app.vue";
import { router } from "./routes/";
import { store } from "store";

import * as filters from "./filters";
const filterNames = Object.keys(filters);
filterNames.forEach((filter) => Vue.filter(filter, filters[filter]));

(async () => {
    await store.dispatch("initialise");
    const configuration = store.state.configuration;
    App.router = router({ configuration });
    App.store = store;

    Vue.use(VueAnalytics, {
        id: "UA-79571514-3",
        debug: {
            sendHitTask: process.env.NODE_ENV === "production",
        },
        router: App.router,
    });

    new Vue(App);
})();
