"use strict";

import restifyErrors from "restify-errors";
const { NotFoundError, UnauthorizedError, ForbiddenError } = restifyErrors;
import { loadConfiguration, route, routeAdmin } from "../common/index.js";
import { setupRoutes as setupAuthRoutes } from "./auth.js";
import { setupRoutes as setupItemRoutes } from "./item.js";
import { setupRoutes as setupCollectionRoutes } from "./collection.js";

export function setupRoutes({ server }) {
    server.get("/", (req, res, next) => {
        res.send({});
        next();
    });
    server.get("/configuration", getConfigurationHandler);
    setupAuthRoutes({ server });
    setupItemRoutes({ server });
    setupCollectionRoutes({ server });
}

// TODO: this code does NOT have tests
async function getConfigurationHandler(req, res, next) {
    let configuration = await loadConfiguration();
    res.send({
        domain: configuration.domain,
        links: configuration.links.toLowerCase() || "default",
        deployment: configuration.deployment.toLowerCase() || "default",
        ui: configuration.ui,
        authentication: Object.keys(configuration.api.authentication),
    });
    next();
}
