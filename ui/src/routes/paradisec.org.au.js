"use strict";

import AdvancedSearchComponent from "../components/paradisec.org.au/AdvancedSearch/Shell.component.vue";
export function router({ routes }) {
    routes = routes.map(route => {
        if (route.path === "/") {
            route.children.push({
                path: "advanced-search",
                component: AdvancedSearchComponent
            });
        }
        return route;
    });
    return routes;
}
