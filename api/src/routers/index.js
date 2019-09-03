"use strict";

const errors = require("restify-errors");

module.exports = {};

function handleError(req, error, next) {
    const message = JSON.parse(error.message.split(" - ")[1]).message;

    switch (error.statusCode) {
        case 400:
            return next(new errors.BadRequestError(message));
            break;
        case 401:
            return next(new errors.UnauthorizedError(message));
            break;
        case 403:
            return next(new errors.ForbiddenError(message));
            break;
        case 409:
            return next(new errors.ConflictError(message));
            break;
        case 426:
            return next(new errors.UpgradeRequiredError(message));
            break;
        case 500:
            return next(new errors.InternalServerError(message));
            break;
    }
}
