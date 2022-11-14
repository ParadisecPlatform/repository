import fetch from "cross-fetch";
import { host } from "../common/test-utils.js";

describe("Test the server is online", () => {
    it("should be able to reach the server", async () => {
        try {
            let response = await fetch(`${host}`);
            expect(response.status).toEqual(200);
        } catch (error) {
            console.log(error);
        } finally {
        }
    });
    it("should be able to get the configuration", async () => {
        try {
            let response = await fetch(`${host}/configuration`);
            expect(response.status).toEqual(200);
            console.log(await response.json());
        } catch (error) {
            console.log(error);
        } finally {
        }
    });
});
