"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import ShellComponent from "components/Shell.component.vue";
import BadRequestComponent from "components/BadRequest.component.vue";
import HealthCheckComponent from "components/HealthCheck.component.vue";
import AboutComponent from "components/About.component.vue";
import ExploreComponent from "components/explore/Shell.component.vue";
import CollectionViewerComponent from "components/CollectionViewer.component.vue";
import ItemViewerComponent from "components/ItemViewer.component.vue";

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
            path: "/",
            component: ShellComponent,
            children: [
                {
                    path: "explore",
                    component: ExploreComponent
                }
            ]
        }
    ];

    // if the app has been configured to serve a single domain
    if (configuration.domain) {
        routes[3].children.push(
            ...[
                {
                    path: ":collectionId",
                    component: CollectionViewerComponent
                },
                {
                    path: ":collectionId/:itemId",
                    component: ItemViewerComponent
                }
            ]
        );
    } else {
        // configured to server multiple domains
        routes[3].children.push(
            ...[
                {
                    path: ":domain/:collectionId",
                    component: CollectionViewerComponent
                },
                {
                    path: ":domain/:collectionId/:itemId",
                    component: ItemViewerComponent
                }
            ]
        );
    }
    const router = new VueRouter({
        mode: "history",
        base: "/",
        routes
    });
    return router;
}
