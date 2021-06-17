"use strict";

import AdvancedSearchComponent from "components/domain/paradisec.org.au/advancedSearch/Shell.component.vue";
import TranscriptionSearchComponent from "components/domain/paradisec.org.au/transcriptionSearch/Shell.component.vue";
import ParadisecLegacyRouterComponent from "components/domain/paradisec.org.au/legacy/LegacyRouter.component.vue";

export function router({ routes }) {
    routes = routes.map((route) => {
        if (route.path === "/") {
            route.children.push({
                path: "advanced-search",
                component: AdvancedSearchComponent,
            });
            route.children.push({
                path: "transcription-search",
                component: TranscriptionSearchComponent,
            });
            route.children.push({
                path: "collections/:collectionId",
                component: ParadisecLegacyRouterComponent,
            });
            route.children.push({
                path: "collections/:collectionId/items/:itemId",
                component: ParadisecLegacyRouterComponent,
            });
            route.children.push({
                path: "collections/:collectionId/items/:itemId/essences/:essenceId",
                component: ParadisecLegacyRouterComponent,
            });
        }
        return route;
    });
    return routes;
}
