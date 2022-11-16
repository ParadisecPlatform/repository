import { host } from "../common/test-utils.js";
import fetch from "cross-fetch";

describe("it should be able to work with profiles", () => {
    it("should be able to retrieve a collection profile", async () => {
        try {
            let response = await fetch(`${host}/profiles/Dataset, RepositoryCollection`);
            let { profile } = await response.json();
            expect(profile.metadata.name).toEqual("NYINGARN Collection Profile");
        } catch (error) {
            console.log(error);
        }
    });
    it("should be able to retrieve an item profile", async () => {
        try {
            let response = await fetch(`${host}/profiles/Dataset, RepositoryObject`);
            let { profile } = await response.json();
            expect(profile.metadata.name).toEqual("NYINGARN Profile");
        } catch (error) {
            console.log(error);
        }
    });
    it("should not find a matching profile", async () => {
        try {
            let response = await fetch(`${host}/profiles/Datase`);
            let { profile } = await response.json();
            expect(profile).toBeNull();
        } catch (error) {
            console.log(error);
        }
    });
});
