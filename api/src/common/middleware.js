import restifyErrors from "restify-errors";
const { UnauthorizedError, ForbiddenError } = restifyErrors;
import { getLogger, loadConfiguration, verifyToken } from "./index.js";
// import { lookupItemByIdentifier } from "../lib/item";
const log = getLogger();

export function route(handler) {
    return [demandAuthenticatedUser, handler];
}

export function routeAdmin(handler) {
    return [demandAuthenticatedUser, demandAdministrator, handler];
}

export async function demandAuthenticatedUser(req, res) {
    if (!req.headers.authorization) {
        return res.status(401).send();
    }
    const configuration = await loadConfiguration();
    try {
        let user = await verifyToken({
            token: req.headers.authorization.split("Bearer ")[1],
            configuration,
        });
        req.session.user = user;
    } catch (error) {
        return res.status(401).send();
    }
}

export async function demandAdministrator(req, res, next) {
    if (!req.session?.user?.administrator) {
        return res.status(403).send();
    }
}

export async function requireIdentifierAccess(req, res) {
    if (!req.body.identifier && !req.params.identifier) {
        return res.status(403).send({ error: `No identifier defined in body or request params` });
    }
    const identifier = req.body.identifier ? req.body.identifier : req.params.identifier;
    let item = await lookupItemByIdentifier({
        userId: req.session.user.id,
        identifier: identifier,
    });
    if (!item) {
        return res.status(403).send({ error: `You don't have access to that item` });
    }
    req.session.item = item;
}
