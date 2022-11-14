"use strict";

import { loadConfiguration } from "../common/index.js";

// const getConfigurationOptions = {
//     schema: {
//         response: {
//             200: {
//                 type: "object",
//                 properties: {
//                     domain: { type: "string" },
//                     links: { type: "string" },
//                     deployment: { type: "string" },
//                     ui: {
//                         type: "object",
//                         properties: {
//                             introduction: { type: "object" },
//                         },
//                     },
//                     authentication: { type: "array" },
//                 },
//             },
//         },
//     },
// };
export async function setupRoutes(fastify, options, done) {
    fastify.get("/", async (req, res) => {
        return {};
    });
    fastify.get("/configuration", getConfigurationHandler);
    done();
}

async function getConfigurationHandler(req, res) {
    let configuration = await loadConfiguration();
    return {
        domain: configuration.domain,
        links: configuration.links.toLowerCase() || "default",
        deployment: configuration.deployment.toLowerCase() || "default",
        ui: configuration.ui,
        authentication: Object.keys(configuration.api.authentication),
    };
}
