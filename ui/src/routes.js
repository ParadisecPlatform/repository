"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";
import RepositoryNotAvailableComponent from "components/RepositoryNotAvailable.component.vue";

export const router = new VueRouter({
    mode: "history",
    base: "/",
    routes: [
        { path: "*", name: "404", component: BadRequestComponent },
        {
            name: "RepositoryNotAvailable",
            path: "/repository-not-available",
            component: RepositoryNotAvailableComponent
        },
        {
            path: "/",
            component: ShellComponent,
            children: []
        }
    ]
});
