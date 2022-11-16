"use strict";

import { loadConfiguration } from "../common/index.js";
import fsExtraPkg from "fs-extra";
const { readJSON } = fsExtraPkg;

export function setupRoutes(fastify, options, done) {
    fastify.get("/profiles/:class", getProfile);
    done();
}

async function getProfile(req, res) {
    let configuration = await loadConfiguration();
    if (configuration.api.profiles[req.params.class]) {
        let profile = await readJSON(configuration.api.profiles[req.params.class]);
        return { profile };
    } else {
        return { profile: null };
    }
}
