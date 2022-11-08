import restify from "restify";
const server = restify.createServer();
import models from "./src/models/index.js";
import { loadConfiguration, getLogger } from "./src/common/index.js";
import { setupRoutes } from "./src/routes/index.js";
const log = getLogger();

(async () => {
    let configuration;
    try {
        configuration = await loadConfiguration();
    } catch (error) {
        log.error("configuration.json not found - stopping now");
        process.exit();
    }
    await models.sequelize.sync();

    if (process.env?.LOG_LEVEL === "debug") {
        server.use((req, res, next) => {
            log.debug(`${req.route.method}: ${req.route.path}`);
            return next();
        });
    }
    server.use(restify.plugins.dateParser());
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.jsonp());
    server.use(restify.plugins.gzipResponse());
    server.use(
        restify.plugins.bodyParser({
            maxBodySize: 0,
            mapParams: true,
            mapFiles: false,
            overrideParams: false,
            multiples: true,
            hash: "sha1",
            rejectUnknown: true,
            requestBodyOnGet: false,
            reviver: undefined,
            maxFieldsSize: 2 * 1024 * 1024,
        })
    );
    setupRoutes({ server });

    server.listen("8080", function () {
        log.info(`ready on ${server.url}`);
    });
})();
