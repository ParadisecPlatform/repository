"use strict";

import { createRouter, createWebHistory } from "vue-router";
import ShellComponent from "components/Shell.component.vue";
import ViewComponent from "components/view/Shell.component.vue";
import DashboardComponent from "components/Dashboard.component.vue";
import CallbackOauthLogin from "components/authentication/OauthCallback.component.vue";

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
        {
            name: "callback-google-login",
            path: "/callback-google-login",
            component: CallbackOauthLogin,
        },
        {
            name: "callback-aaf-login",
            path: "/callback-aaf-login",
            component: CallbackOauthLogin,
        },
    ];

    const router = createRouter({
        history: createWebHistory("/"),
        routes,
        strict: true,
    });
    return router;
}
