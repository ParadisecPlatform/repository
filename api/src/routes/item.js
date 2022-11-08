"use strict";

import restifyErrors from "restify-errors";
const { NotFoundError, UnauthorizedError, ForbiddenError } = restifyErrors;
import { loadConfiguration, route, routeAdmin } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";
import { Parser } from "@coedl/transcription-parsers";

export function setupRoutes({ server }) {
    // default item route paths
    server.get("/items/:itemId/metadata", getItemMetadataHandler);
    server.get("/items/:itemId/pre-signed-url/:filename", getItemFilePresignedUrl);
    server.get("/items/:itemId/transcription/:filename", getItemTranscriptionHandler);
    server.get("/items/:itemId/file/:filename", getItemFileHandler);

    // paradisec item route paths
    server.get("/collections/:collectionId/items/:itemId/metadata", getItemMetadataHandler);
    server.get(
        "/collections/:collectionId/items/:itemId/pre-signed-url/:filename",
        getItemFilePresignedUrl
    );
    server.get(
        "/collections/:collectionId/items/:itemId/transcription/:filename",
        getItemTranscriptionHandler
    );
    server.get("/collections/:collectionId/items/:itemId/file/:filename", getItemFileHandler);
}

// TODO: this code does NOT have tests
async function getItemMetadataHandler(req, res, next) {
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
        return next(new NotFoundError());
    }
    let crate = await store.getJSON({ target: "ro-crate-metadata.json" });
    res.send({ crate });
    next();
}

// TODO: this code does NOT have tests
async function getItemFilePresignedUrl(req, res, next) {
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
        return next(new NotFoundError());
    }
    let url = await store.getPresignedUrl({ target: req.params.filename });
    res.send({ url });
    next();
}

// TODO: this code does NOT have tests
async function getItemFileHandler(req, res, next) {
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
        return next(new NotFoundError());
    }
    exists = await store.pathExists({ path: req.params.filename });
    if (!exists) {
        return next(new NotFoundError());
    }

    let content = await store.get({ target: req.params.filename });

    res.send({ content });
    next();
}

// TODO: this code does NOT have tests
async function getItemTranscriptionHandler(req, res, next) {
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
        return next(new NotFoundError());
    }
    exists = await store.pathExists({ path: req.params.filename });
    if (!exists) {
        return next(new NotFoundError());
    }
    let xmlString = await store.get({ target: req.params.filename });

    let parser = new Parser({
        name: req.params.filename,
        data: xmlString,
    });
    let transcription = await parser.parse();

    res.send({ transcription });
    next();
}

// TODO: this code does NOT have tests
function getItemIdentifier({ configuration, params }) {
    if (configuration.links === "paradisec" && params.collectionId && params.itemId) {
        return `${params.collectionId}_${params.itemId}`;
    } else {
        return params.itemId;
    }
}
