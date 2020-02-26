"use strict";

import AdvancedSearchComponent from "components/domain/paradisec.org.au/advancedSearch/Shell.component.vue";
import TranscriptionSearchComponent from "components/domain/paradisec.org.au/transcriptionSearch/Shell.component.vue";
export function router({ routes }) {
    routes = routes.map(route => {
        if (route.path === "/") {
            route.children.push({
                path: "advanced-search",
                component: AdvancedSearchComponent
            });
            route.children.push({
                path: "transcription-search",
                component: TranscriptionSearchComponent
            });
        }
        return route;
    });
    return routes;
}
