"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";
import HealthCheckComponent from "components/HealthCheck.component.vue";
import ExploreComponent from "components/Explore.component.vue";

export const router = new VueRouter({
    mode: "history",
    base: "/",
    routes: [
        { path: "*", name: "404", component: BadRequestComponent },
        {
            name: "HealthCheck",
            path: "/health-check",
            component: HealthCheckComponent
        },
        {
            path: "/",
            component: ShellComponent,
            children: [
                {
                    name: "Explore",
                    path: "explore",
                    component: ExploreComponent
                }
            ]
        }
    ]
});
