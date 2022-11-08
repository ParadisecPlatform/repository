import { loadConfiguration, route, routeAdmin } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";
import { host } from "../common/test-utils.js";
import { isEmpty } from "lodash";
import Chance from "chance";
import fetch from "cross-fetch";
const chance = Chance();

describe("it should be able to work with collections", () => {
    it("should be able to retrieve the metadata for a collection", async () => {
        let identifier = chance.word();

        let configuration = await loadConfiguration();
        let store = new Store({
            domain: configuration.domain,
            className: "collection",
            id: identifier,
            credentials: configuration.api.s3,
        });
        await store.createItem();

        try {
            let response = await fetch(`${host}/collections/${identifier}/metadata`);
            let { crate } = await response.json();
            expect(isEmpty(crate)).toBeFalse;
        } catch (error) {
            console.log(error);
        } finally {
            await store.deleteItem();
        }
    });
    it("should not find the requested collection", async () => {
        let identifier = chance.word();
        try {
            let response = await fetch(`${host}/collections/${identifier}/metadata`);
            expect(response.status).toBe(404);
        } catch (error) {
            console.log(error);
        }
    });
});
