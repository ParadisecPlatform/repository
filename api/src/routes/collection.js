"use strict";

import restifyErrors from "restify-errors";
const { NotFoundError, UnauthorizedError, ForbiddenError } = restifyErrors;
import { loadConfiguration, route, routeAdmin } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";

export function setupRoutes({ server }) {
    server.get("/collections/:collectionId/metadata", getCollectionMetadataHandler);
}

async function getCollectionMetadataHandler(req, res, next) {
    let configuration = await loadConfiguration();
    let store = new Store({
        domain: configuration.domain,
        className: "collection",
        id: req.params.collectionId,
        credentials: configuration.api.s3,
    });

    const exists = await store.itemExists();
    if (!exists) {
        return next(new NotFoundError());
    }
    let crate = await store.getJSON({ target: "ro-crate-metadata.json" });
    res.send({ crate });
    next();
}
