"use strict";

require("source-map-support").install();
require("app-module-path/cwd");
// require("app-module-path").addPath("src/common/node_modules");
const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware");
const routers = require("src/routers");
// const models = require("src/common/models");
// const { injectSystemConfiguration } = require("src/common/models/utils");
const { compact } = require("lodash");
// const {
//     createRequestIdentifier,
//     routeLogger
// } = require("src/common/logger/utils");

try {
    // verify();
} catch (e) {
    console.log(e.message);
    console.log("Exiting");
    process.exit(-1);
}
setup().then(server => {
    return server.listen(3000, function() {
        console.log(`${server.name} listening at ${server.url}`);
    });
});

function setup() {
    // return models.sequelize
    //     .sync()
    //     .then(() => {
    //         console.log("DB connection established successfully.");
    //         return createServer();
    //     })
    //     .catch(e => {
    //         console.log("Couldn't initialise application.");
    //         console.log(e);
    //         process.exit(-1);
    //     });

    return new Promise((resolve, reject) => {
        let server = createServer();
        resolve(server);
    });
    function createServer() {
        const server = restify.createServer();
        server.name = "api";
        if (process.env.NODE_ENV === "development") {
            const cors = corsMiddleware({
                preflightMaxAge: 5,
                origins: ["*"],
                allowHeaders: ["authorization", "x-modpdsc-dataset-token"],
                exposeHeaders: ["authorization", "x-modpdsc-dataset-token"]
            });
            server.pre(cors.preflight);
            server.use(cors.actual);
        }
        server.use(restify.plugins.acceptParser(server.acceptable));
        server.use(restify.plugins.dateParser());
        server.use(restify.plugins.queryParser());
        server.use(restify.plugins.jsonp());
        server.use(restify.plugins.gzipResponse());
        server.use(middlewareApplicator(restify.plugins.bodyParser()));
        server.use(restify.plugins.conditionalRequest());
        // server.use(injectSystemConfiguration);
        // server.use(createRequestIdentifier);
        // server.use(routeLogger);
        // routers.wireUpRoutes(server);
        return server;
    }
}

function middlewareApplicator(middleware) {
    return function(req, res, next) {
        const localPaths = ["^/login$", "^/super/login$", "/accounts/.*"];

        let regex;
        const match = localPaths.map(p => {
            regex = new RegExp(p, "g");
            return regex.test(req.route.path) ? true : false;
        });
        if (compact(match).length) {
            if (middleware instanceof Array) {
                middleware[0](req, res, function() {
                    middleware[1](req, res, next);
                });
            } else {
                middleware(req, res, next);
            }
        } else {
            next();
        }
    };
}
