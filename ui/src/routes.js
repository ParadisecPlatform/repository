"use strict";

import { createRouter, createWebHistory } from "vue-router";
import ShellComponent from "components/Shell.component.vue";
import ViewComponent from "components/view/Shell.component.vue";
import DashboardComponent from "components/Dashboard.component.vue";

export function router({ configuration }) {
    let routes = [
        {
            path: "/",
            name: "root",
            component: ShellComponent,
            children: [
                {
                    path: "dashboard",
                    component: DashboardComponent,
                    props: true,
                },
                {
                    path: "collections/:collectionId",
                    component: ViewComponent,
                    props: true,
                },
                {
                    path: "items/:itemId",
                    component: ViewComponent,
                    props: true,
                    children: [
                        {
                            path: ":contentType",
                            component: ViewComponent,
                            props: true,
                            children: [
                                {
                                    path: ":contentId",
                                    component: ViewComponent,
                                    props: true,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: "collections/:collectionId/items/:itemId",
                    component: ViewComponent,
                    props: true,
                    children: [
                        {
                            path: ":contentType",
                            component: ViewComponent,
                            props: true,
                            children: [
                                {
                                    path: ":contentId",
                                    component: ViewComponent,
                                    props: true,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];

    const router = createRouter({
        history: createWebHistory("/"),
        routes,
        strict: true,
    });
    return router;
}
