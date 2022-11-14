"use strict";

import { loadConfiguration } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";
import { Parser } from "@coedl/transcription-parsers";

export function setupRoutes(fastify, options, done) {
    // default item route paths
    fastify.get("/items/:itemId/metadata", getItemMetadataHandler);
    fastify.get("/items/:itemId/pre-signed-url/:filename", getItemFilePresignedUrl);
    fastify.get("/items/:itemId/transcription/:filename", getItemTranscriptionHandler);
    fastify.get("/items/:itemId/file/:filename", getItemFileHandler);

    // paradisec item route paths
    fastify.get("/collections/:collectionId/items/:itemId/metadata", getItemMetadataHandler);
    fastify.get(
        "/collections/:collectionId/items/:itemId/pre-signed-url/:filename",
        getItemFilePresignedUrl
    );
    fastify.get(
        "/collections/:collectionId/items/:itemId/transcription/:filename",
        getItemTranscriptionHandler
    );
    fastify.get("/collections/:collectionId/items/:itemId/file/:filename", getItemFileHandler);

    done();
}

async function getItemMetadataHandler(req, res) {
    let configuration = await loadConfiguration();

    const identifier = getItemIdentifier({ configuration, params: req.params });
    let store = new Store({
        domain: configuration.domain,
        className: "item",
        id: identifier,
        credentials: configuration.api.s3,
    });
    const exists = await store.itemExists();
    if (!exists) {
        return res.notFound();
    }
    let crate = await store.getJSON({ target: "ro-crate-metadata.json" });
    return { crate };
}

async function getItemFilePresignedUrl(req, res) {
    let configuration = await loadConfiguration();

    const identifier = getItemIdentifier({ configuration, params: req.params });
    let store = new Store({
        domain: configuration.domain,
        className: "item",
        id: identifier,
        credentials: configuration.api.s3,
    });
    const exists = await store.itemExists();
    if (!exists) {
        return res.notFound();
    }
    let url = await store.getPresignedUrl({ target: req.params.filename });
    return { url };
}

async function getItemFileHandler(req, res) {
    let configuration = await loadConfiguration();

    const identifier = getItemIdentifier({ configuration, params: req.params });
    let store = new Store({
        domain: configuration.domain,
        className: "item",
        id: identifier,
        credentials: configuration.api.s3,
    });
    let exists = await store.itemExists();
    if (!exists) {
        return res.notFound();
    }
    exists = await store.pathExists({ path: req.params.filename });
    if (!exists) {
        return res.notFound();
    }

    let content = await store.get({ target: req.params.filename });

    return { content };
}

async function getItemTranscriptionHandler(req, res) {
    let configuration = await loadConfiguration();

    const identifier = getItemIdentifier({ configuration, params: req.params });
    let store = new Store({
        domain: configuration.domain,
        className: "item",
        id: identifier,
        credentials: configuration.api.s3,
    });
    let exists = await store.itemExists();
    if (!exists) {
        return res.notFound();
    }
    exists = await store.pathExists({ path: req.params.filename });
    if (!exists) {
        return res.status(404).send();
    }
    let xmlString = await store.get({ target: req.params.filename });

    let parser = new Parser({
        name: req.params.filename,
        data: xmlString,
    });
    let transcription = await parser.parse();

    return { transcription };
}

function getItemIdentifier({ configuration, params }) {
    if (configuration.links === "paradisec" && params.collectionId && params.itemId) {
        return `${params.collectionId}_${params.itemId}`;
    } else {
        return params.itemId;
    }
}
