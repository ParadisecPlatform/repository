import { loadConfiguration, route, routeAdmin } from "../common/index.js";
import { Store } from "@coedl/nocfl-js";
import { host } from "../common/test-utils.js";
import { isEmpty } from "lodash";
import Chance from "chance";
import fetch from "cross-fetch";
const chance = Chance();

describe("it should be able to work with items", () => {
    it("should be able to retrieve the metadata for an item ", async () => {
        let identifier = chance.word();

        let configuration = await loadConfiguration();
        let store = new Store({
            domain: configuration.domain,
            className: "item",
            id: identifier,
            credentials: configuration.api.s3,
        });
        await store.createItem();

        try {
            let response = await fetch(`${host}/items/${identifier}/metadata`);
            let { crate } = await response.json();
            expect(isEmpty(crate)).toBeFalse;
        } catch (error) {
            console.log(error);
        } finally {
            await store.deleteItem();
        }
    });
    it("should not find the requested item", async () => {
        let identifier = chance.word();
        try {
            let response = await fetch(`${host}/items/${identifier}/metadata`);
            expect(response.status).toBe(404);
        } catch (error) {
            console.log(error);
        }
    });
    it("should be able to get a presigned url to an item file", async () => {
        let identifier = chance.word();

        let configuration = await loadConfiguration();
        let store = new Store({
            domain: configuration.domain,
            className: "item",
            id: identifier,
            credentials: configuration.api.s3,
        });
        await store.createItem();

        try {
            let response = await fetch(
                `${host}/items/${identifier}/pre-signed-url/ro-crate-metadata.json`
            );
            let { urls } = await response.json();
            const re = new RegExp(`${configuration.api.s3.endpoint}.*\/ro-crate-metadata.json.*`);
            expect(urls.length).toEqual(1);
            expect(urls[0]).toMatch(re);
        } catch (error) {
            console.log(error);
        } finally {
            await store.deleteItem();
        }
    });
    it("should not able to get a presigned url to an item file", async () => {
        let identifier = chance.word();

        try {
            let response = await fetch(
                `${host}/items/${identifier}/pre-signed-url/ro-crate-metadata.json`
            );
            expect(response.status).toEqual(404);
        } catch (error) {
            console.log(error);
        } finally {
        }
    });
    it("should be able to get the content of a file", async () => {
        let identifier = chance.word();

        let configuration = await loadConfiguration();
        let store = new Store({
            domain: configuration.domain,
            className: "item",
            id: identifier,
            credentials: configuration.api.s3,
        });
        await store.createItem();
        await store.put({ target: "file.txt", content: "some text" });

        try {
            let response = await fetch(`${host}/items/${identifier}/file/file.txt`);
            let { content } = await response.json();
            expect(content).toEqual("some text");
        } catch (error) {
            console.log(error);
        } finally {
            await store.deleteItem();
        }
    });
    it("should not be able to get the content of a file", async () => {
        let identifier = chance.word();

        try {
            let response = await fetch(`${host}/items/${identifier}/file/file.txt`);
            expect(response.status).toEqual(404);
        } catch (error) {
            console.log(error);
        } finally {
        }
    });
    it("should be able to get a transcription", async () => {
        let identifier = chance.word();

        let configuration = await loadConfiguration();
        let store = new Store({
            domain: configuration.domain,
            className: "item",
            id: identifier,
            credentials: configuration.api.s3,
        });
        await store.createItem();
        await store.put({ target: "file.eaf", localPath: "./src/test-files/file.eaf" });

        try {
            let response = await fetch(`${host}/items/${identifier}/transcription/file.eaf`);
            let { transcription } = await response.json();
            expect(transcription.type).toEqual("eaf");
            expect(transcription.statistics).toEqual({
                duration: 13480,
                numberOfTimeslots: 2,
                startTime: 0,
                endTime: 13480,
                numberOfTiers: 1,
                coveredByAnnotations: 100,
                emptyTiers: false,
                unmappedAnnotations: [],
                referenceAnnotations: 0,
                alignableAnnotations: 1,
                annotationsWithContent: { count: 1, percentage: 100 },
            });
        } catch (error) {
            console.log(error);
        } finally {
            await store.deleteItem();
        }
    });
    it("should not be able to get a transcription", async () => {
        let identifier = chance.word();

        try {
            let response = await fetch(`${host}/items/${identifier}/transcription/file.eaf`);
            expect(response.status).toEqual(404);
        } catch (error) {
            console.log(error);
        } finally {
        }
    });
});
