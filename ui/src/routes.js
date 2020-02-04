"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";
import HealthCheckComponent from "components/HealthCheck.component.vue";
import AboutComponent from "components/About.component.vue";
import ExploreComponent from "components/explore/Shell.component.vue";
import IntroductionComponent from "components/introduction/Shell.component.vue";
import ViewComponent from "components/view/Shell.component.vue";
import SupportComponent from "components/support/Shell.component.vue";

export function router({ configuration }) {
    const routes = [
        { path: "*", name: "404", component: BadRequestComponent },
        {
            name: "HealthCheck",
            path: "/health-check",
            component: HealthCheckComponent
        },
        {
            name: "About",
            path: "/about",
            component: AboutComponent
        },
        {
            name: "Support",
            path: "/support",
            component: SupportComponent
        },
        {
            path: "/",
            component: ShellComponent,
            children: [
                {
                    path: "/",
                    component: IntroductionComponent
                },
                {
                    path: "explore",
                    component: ExploreComponent
                },
                {
                    path: "view*",
                    component: ViewComponent
                }
            ]
        }
    ];

    const router = new VueRouter({
        mode: "history",
        base: "/",
        routes
    });
    return router;
}
