import models from "../models/index.js";
import { loadConfiguration, logEvent } from "../common/index.js";

export async function getUsers({ offset = 0, limit = 10, orderBy = "familyName" }) {
    let direction = orderBy === "upload" ? "DESC" : "ASC NULLS LAST";
    let users = await models.user.findAndCountAll({
        offset,
        limit,
        order: [[orderBy, direction]],
    });
    return { total: users.count, users: users.rows.map((u) => u.get()) };
}

export async function getUser({ userId, email, orderBy }) {
    let where = {};
    if (userId) where.id = userId;
    if (email) where.email = email;
    let user = await models.user.findOne({
        where,
    });
    return user;
}

export async function createUser(data) {
    const configuration = await loadConfiguration();
    if (!data.email) {
        throw new Error(`Email is a required property`);
    }
    if (!data.provider) {
        throw new Error(`Provider is a required property`);
    }

    data.locked = false;
    data.administrator = false;
    data.provider = data.provider;
    data.givenName = data.givenName;
    data.familyName = data.familyName;

    let [user, created] = await models.user.findOrCreate({
        where: { email: data.email },
        defaults: data,
    });

    if (configuration.api.administrators.includes(data.email)) {
        // email in admin list
        user.administrator = true;
        await user.save();
    }
    if (created) {
        await logEvent({
            level: "info",
            owner: user.email,
            text: `The account for '${user.email}' has been created.`,
        });
    }
    return user;
}

export async function deleteUser({ userId }) {
    let user = await models.user.findOne({ where: { id: userId } });
    await user.destroy();
}

export async function toggleUserCapability({ userId, capability }) {
    let user = await models.user.findOne({ where: { id: userId } });
    switch (capability) {
        case "lock":
            user.locked = !user.locked;
            break;
        case "admin":
            user.administrator = !user.administrator;
            break;
    }
    user = await user.save();
    return user;
}
