"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "assets/global-styles.scss";

import Vue from "vue";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import VueScrollTo from "vue-scrollto";
import infiniteScroll from "vue-infinite-scroll";
import VueAnalytics from "vue-analytics";
import { VueMasonryPlugin } from "vue-masonry";
Vue.use(ElementUI, { locale });
Vue.use(VueScrollTo);
Vue.use(infiniteScroll);
Vue.use(VueMasonryPlugin);
import App from "components/app.vue";
import { router } from "./routes";
import { store } from "store";

Vue.use(VueAnalytics, {
    id: "UA-79571514-3",
    debug: {
        sendHitTask: process.env.NODE_ENV === "production"
    },
    router
});
(async () => {
    await store.dispatch("initialise");
    const configuration = store.state.configuration;
    App.router = router({ configuration });
    App.store = store;
    new Vue(App);
})();
