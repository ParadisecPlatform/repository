"use strict";

import { loadConfiguration } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";

export function setupRoutes(fastify, options, done) {
    fastify.get("/collections/:collectionId/metadata", getCollectionMetadataHandler);
    done();
}

async function getCollectionMetadataHandler(req, res) {
    let configuration = await loadConfiguration();
    let store = new Store({
        domain: configuration.domain,
        className: "collection",
        id: req.params.collectionId,
        credentials: configuration.api.s3,
    });

    const exists = await store.itemExists();
    if (!exists) {
        return res.notFound();
    }
    let crate = await store.getJSON({ target: "ro-crate-metadata.json" });
    return { crate };
}
