import models from "./src/models/index.js";
import { loadConfiguration, getLogger } from "./src/common/index.js";
import { setupRoutes as setupBaseRoutes } from "./src/routes/index.js";
import { setupRoutes as setupAuthRoutes } from "./src/routes/auth.js";
import { setupRoutes as setupItemRoutes } from "./src/routes/item.js";
import { setupRoutes as setupCollectionRoutes } from "./src/routes/collection.js";
import { setupRoutes as setupProfileRoutes } from "./src/routes/profile.js";

import Fastify from "fastify";
import fastifyCompress from "@fastify/compress";
import cors from "@fastify/cors";
import fastifySensible from "@fastify/sensible";

const log = getLogger();
const envToLogger = {
    development: {
        transport: {
            target: "pino-pretty",
            options: { ignore: "reqId,req.hostname,req.remoteAddress,req.remotePort" },
        },
    },
    production: true,
    test: false,
};
const fastify = Fastify({ logger: envToLogger[process.env.NODE_ENV] });

main();
async function main() {
    let configuration;
    try {
        configuration = await loadConfiguration();
    } catch (error) {
        log.error("configuration.json not found - stopping now");
        process.exit();
    }
    await models.sequelize.sync();

    if (process.env.NODE_ENV === "development") {
        fastify.register(cors, { origin: "*" });
    }
    fastify.register(fastifySensible);
    fastify.register(fastifyCompress);
    fastify.addHook("onRequest", (req, res, done) => {
        req.session = {};
        done();
    });
    fastify.register(setupBaseRoutes);
    fastify.register(setupAuthRoutes);
    fastify.register(setupItemRoutes);
    fastify.register(setupCollectionRoutes);
    fastify.register(setupProfileRoutes);

    fastify.listen({ port: 8080, host: "0.0.0.0" }, function (err, address) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}
