import models from "./src/models/index.js";
import { loadConfiguration, getLogger } from "./src/common/index.js";
import { setupRoutes as setupBaseRoutes } from "./src/routes/index.js";
import { setupRoutes as setupAuthRoutes } from "./src/routes/auth.js";
import { setupRoutes as setupItemRoutes } from "./src/routes/item.js";
import { setupRoutes as setupCollectionRoutes } from "./src/routes/collection.js";

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

    if (process.env?.LOG_LEVEL === "debug") {
        // server.use((req, res, next) => {
        //     log.debug(`${req.route.method}: ${req.route.path}`);
        //     return next();
        // });
    }
    // server.use(restify.plugins.dateParser());
    // server.use(restify.plugins.queryParser());
    // server.use(restify.plugins.jsonp());
    // server.use(restify.plugins.gzipResponse());
    // server.use(
    //     restify.plugins.bodyParser({
    //         maxBodySize: 0,
    //         mapParams: true,
    //         mapFiles: false,
    //         overrideParams: false,
    //         multiples: true,
    //         hash: "sha1",
    //         rejectUnknown: true,
    //         requestBodyOnGet: false,
    //         reviver: undefined,
    //         maxFieldsSize: 2 * 1024 * 1024,
    //     })
    // );
    // setupRoutes({ server });
    // setupRoutes({ server: fastify });
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

    fastify.listen({ port: 8080, host: "0.0.0.0" }, function (err, address) {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    });
}
