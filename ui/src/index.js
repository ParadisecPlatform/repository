"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";

import Vue from "vue";
import ElementUI from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import VueScrollTo from "vue-scrollto";
import infiniteScroll from "vue-infinite-scroll";
import { VueMasonryPlugin } from "vue-masonry";
Vue.use(ElementUI, { locale });
Vue.use(VueScrollTo);
Vue.use(infiniteScroll);
Vue.use(VueMasonryPlugin);

import App from "components/app.vue";
import { router } from "./routes";
import { store } from "store";

App.router = router;
App.store = store;
const app = new Vue(App);
