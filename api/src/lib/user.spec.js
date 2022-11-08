import { getUsers, getUser, createUser, deleteUser, toggleUserCapability } from "./user.js";
import Chance from "chance";
const chance = Chance();
import {
    setupBeforeAll,
    setupBeforeEach,
    teardownAfterAll,
    teardownAfterEach,
} from "../common/index.js";

describe("User management tests", () => {
    let users, configuration;
    const userEmail = chance.email();
    const adminEmail = chance.email();
    beforeAll(async () => {
        configuration = await setupBeforeAll({ adminEmails: [adminEmail] });
    });
    beforeEach(async () => {
        users = await setupBeforeEach({ emails: [userEmail] });
    });
    afterEach(async () => {
        await teardownAfterEach({});
    });
    afterAll(async () => {
        await teardownAfterAll(configuration);
    });
    it("should be able to get a list of users", async () => {
        let userDef = users[0];
        // expect to find two users
        let accounts = await getUsers({});
        expect(accounts.users.length).toEqual(1);
        expect(accounts.users[0].email).toEqual(userDef.email);

        // expect to find no users
        accounts = await getUsers({ offset: 10 });
        expect(accounts.users.length).toEqual(0);

        // expect to find no users
        accounts = await getUsers({ age: 0, limit: 0 });
        expect(accounts.users.length).toEqual(0);
    });
    it("should be able to get a specified user", async () => {
        let userDef = users[0];
        let user = await getUser({ userId: userDef.id });
        expect(user.email).toEqual(userDef.email);

        user = await getUser({ email: userDef.email });
        expect(user.email).toEqual(userDef.email);
        await user.destroy();

        user = await getUser({ email: chance.word() });
        expect(user).toBeNull;
    });
    it("should be able to set up a normal user account", async () => {
        let email = chance.email();

        //  create user
        let user = await createUser({
            email,
            provider: "Google",
        });
        expect(user.email).toEqual(email);
        await user.destroy();
    });
    it("should be able to set up an admin user account", async () => {
        //  create admin user account
        let user = await createUser({
            email: adminEmail,
            provider: "Google",
            locked: false,
        });
        expect(user.email).toEqual(adminEmail);
    });
    it("should be able to lock a user", async () => {
        let userDef = users[0];
        let user = await getUser({ userId: userDef.id });
        user = await toggleUserCapability({
            userId: user.id,
            capability: "lock",
        });
        expect(user.locked).toEqual(true);

        user = await toggleUserCapability({
            userId: user.id,
            capability: "lock",
        });
        expect(user.locked).toEqual(false);
    });
    it("should be able to toggle user upload privileges", async () => {
        let userDef = users[0];
        let user = await getUser({ userId: userDef.id });
        user = await toggleUserCapability({
            userId: user.id,
            capability: "admin",
        });
        expect(user.administrator).toEqual(true);

        user = await toggleUserCapability({
            userId: user.id,
            capability: "admin",
        });
        expect(user.administrator).toEqual(false);
        await user.destroy();
    });
});
