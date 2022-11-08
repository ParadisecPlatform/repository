import restifyErrorsPkg from "restify-errors";
const { BadRequestError, UnauthorizedError, ServiceUnavailableError } = restifyErrorsPkg;
import { loadConfiguration, getLogger, route, routeAdmin } from "../common/index.js";
import { jwtVerify, createRemoteJWKSet } from "jose";
import { Issuer, generators } from "openid-client";
import { createUser } from "../lib/user.js";
import { createSession } from "../lib/session.js";
import models from "../models/index.js";
const log = getLogger();

export function setupRoutes({ server }) {
    server.get("/auth/:provider/login", getLoginUrlRouteHandler);
    server.post("/auth/:provider/code", getOauthTokenRouteHandler);
    server.get(
        "/authenticated",
        route(async (req, res, next) => {
            res.send({ user: req.session.user });
            next();
        })
    );
    server.get(
        "/admin",
        routeAdmin(async (req, res, next) => {
            res.send({ user: req.session.user });
            next();
        })
    );
    server.get("/logout", async (req, res, next) => {
        let token = req.headers.authorization?.split("Bearer ")[1];
        if (token) {
            let session = await models.session.findOne({ where: { token } });
            if (session) await session.destroy();
        }
        next(new UnauthorizedError());
    });
}

async function getLoginUrlRouteHandler(req, res, next) {
    const provider = req.params.provider;

    let configuration = await loadConfiguration();
    try {
        configuration = configuration.api.authentication[provider];
    } catch (error) {
        return next(new ServiceUnavailableError());
    }
    let issuer = await Issuer.discover(configuration.discover);
    const client = new issuer.Client({
        client_id: configuration.clientId,
        client_secret: configuration.clientSecret,
        redirect_uris: [configuration.redirectUri],
        response_types: ["code"],
    });
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    const code_challenge_method = "S256";
    const url = client.authorizationUrl({
        scope: "openid email profile",
        code_challenge,
        code_challenge_method,
        state: provider,
    });
    res.send({ url, code_verifier });
    next();
}

async function getOauthTokenRouteHandler(req, res, next) {
    const provider = req.params.provider;
    if (!req.body.code) {
        return next(new BadRequestError(`Code not provided`));
    }

    let configuration = await loadConfiguration();
    let { token, jwks } = await getOauthToken({
        provider,
        code: req.body.code,
        code_verifier: req.body.code_verifier,
        configuration,
    });

    let userData = await extractUserDataFromIdToken({ configuration, provider, jwks, token });

    let user = await createUser(userData);

    if (user?.locked) {
        log.info(`The account for '${user.email}' is locked. Denying user login.`);
        return next(new UnauthorizedError());
    }

    log.debug(`Creating session for ${user.email}`);
    let session = await createSession({ user });

    res.send({ token: session.token });
    next();
}

async function getOauthToken({ provider, code, code_verifier, configuration }) {
    configuration = configuration.api.authentication[provider];
    let issuer = await Issuer.discover(configuration.discover);
    const client = new issuer.Client({
        client_id: configuration.clientId,
        client_secret: configuration.clientSecret,
        redirect_uris: [configuration.redirectUri],
        response_types: ["code"],
    });
    let token = await client.callback(configuration.redirectUri, { code }, { code_verifier });
    return { token, jwks: issuer.jwks_uri };
}

export async function extractUserDataFromIdToken({ configuration, provider, jwks, token }) {
    configuration = configuration.api.authentication[provider];
    const JWKS = createRemoteJWKSet(new URL(jwks));
    let tokenData = await jwtVerify(token.id_token, JWKS, {
        audience: configuration.clientId,
    });
    let { email, given_name, family_name } = tokenData.payload;
    return { provider, email, givenName: given_name, familyName: family_name };
}
