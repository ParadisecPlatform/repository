"use strict";

import { loadConfiguration } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";
import { Parser } from "@coedl/transcription-parsers";
import { transformDocument } from "../lib/transform.js";

export function setupRoutes(fastify, options, done) {
    fastify.addHook("preHandler", verifyItemExists);

    // default item route paths
    fastify.get("/items/:itemId/metadata", getItemMetadataHandler);
    fastify.get("/items/:itemId/pre-signed-url/:filename", getItemFilePresignedUrl);
    fastify.post("/items/:itemId/pre-signed-url", getItemFilePresignedUrl);
    fastify.get("/items/:itemId/transcription/:filename", getItemTranscriptionHandler);
    fastify.get("/items/:itemId/tei/:filename", getItemTeiHandler);
    fastify.get("/items/:itemId/file/:filename", getItemFileHandler);

    // paradisec item route paths
    fastify.get("/collections/:collectionId/items/:itemId/metadata", getItemMetadataHandler);
    fastify.get(
        "/collections/:collectionId/items/:itemId/pre-signed-url/:filename",
        getItemFilePresignedUrl
    );
    fastify.post(
        "/collections/:collectionId/items/:itemId/pre-signed-url",
        getItemFilePresignedUrl
    );
    fastify.get(
        "/collections/:collectionId/items/:itemId/transcription/:filename",
        getItemTranscriptionHandler
    );
    fastify.get("/collections/:collectionId/items/:itemId/tei/:filename", getItemTeiHandler);
    fastify.get("/collections/:collectionId/items/:itemId/file/:filename", getItemFileHandler);
    done();
}

async function verifyItemExists(req, res) {
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
    req.session.configuration = configuration;
    req.session.store = store;
}

async function getItemMetadataHandler(req, res) {
    let crate = await req.session.store.getJSON({ target: "ro-crate-metadata.json" });
    return { crate };
}

async function getItemFilePresignedUrl(req, res) {
    let urls = [];
    if (req.params.filename) {
        let url = await req.session.store.getPresignedUrl({ target: req.params.filename });
        urls.push(url);
    } else if (req.body.images.length) {
        for (let image of req.body.images) {
            let url = await req.session.store.getPresignedUrl({ target: image });
            urls.push(url);
        }
    }
    return { urls };
}

async function getItemFileHandler(req, res) {
    let exists = await req.session.store.pathExists({ path: req.params.filename });
    if (!exists) {
        return res.notFound();
    }

    let content = await req.session.store.get({ target: req.params.filename });

    return { content };
}

async function getItemTranscriptionHandler(req, res) {
    let exists = await req.session.store.pathExists({ path: req.params.filename });
    if (!exists) {
        return res.status(404).send();
    }
    let xmlString = await req.session.store.get({ target: req.params.filename });

    let parser = new Parser({
        name: req.params.filename,
        data: xmlString,
    });
    let transcription = await parser.parse();

    return { transcription };
}

// TODO: this code does not have tests
async function getItemTeiHandler(req, res) {
    try {
        let document = await req.session.store.get({ target: `${req.params.filename}.tei.xml` });
        document = await transformDocument({ document });
        return { document };
    } catch (error) {
        res.notFound();
    }
}

function getItemIdentifier({ configuration, params }) {
    if (configuration.links === "paradisec" && params.collectionId && params.itemId) {
        return `${params.collectionId}_${params.itemId}`;
    } else {
        return params.itemId;
    }
}
