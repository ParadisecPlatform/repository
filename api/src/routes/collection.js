"use strict";

import { loadConfiguration } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";

export function setupRoutes(fastify, options, done) {
    fastify.addHook("preHandler", verifyCollectionExists);

    fastify.get("/collections/:collectionId/metadata", getCollectionMetadataHandler);
    done();
}

async function verifyCollectionExists(req, res) {
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
    req.session.configuration = configuration;
    req.session.store = store;
}

async function getCollectionMetadataHandler(req, res) {
    const exists = await req.session.store.itemExists();
    if (!exists) {
        return res.notFound();
    }
    let crate = await req.session.store.getJSON({ target: "ro-crate-metadata.json" });
    return { crate };
}
