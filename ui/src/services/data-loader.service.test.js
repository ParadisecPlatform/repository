"use strict";

import util from "util";
import fs from "fs";
import { orderBy } from "lodash";
const readFile = util.promisify(fs.readFile);
import { DataLoader } from "./data-loader.service";
const dataLoader = new DataLoader();

test("test extracting datafiles from OCFL inventory.json", async () => {
    let inventory = await readFile(
        `${__dirname}/test-data/ocfl-inventory.json`
    );
    inventory = JSON.parse(inventory);
    let datafiles = dataLoader.extractObjectDataFiles({ inventory });
    expect(datafiles).toMatchObject({
        "item.json": "v1/content/item.json",
        "ro-crate-metadata.jsonld": "v1/content/ro-crate-metadata.jsonld"
    });
});

test("test turning rocrate back in to object - collection AC1", async () => {
    let rocrate = await readFile(`${__dirname}/test-data/AC1.json`);
    rocrate = JSON.parse(rocrate);
    rocrate = await dataLoader.objectify({
        rocrate,
        context: "https://schema.org/docs/jsonldcontext.jsonld"
    });
    expect(rocrate["http://pcdm.org/models#hasMember"].length).toBe(226);
    expect(rocrate.identifier).toMatchObject([
        {
            type: "PropertyValue",
            name: "domain",
            value: "paradisec.org.au"
        },
        {
            type: "PropertyValue",
            name: "id",
            value: "paradisec.org.au/AC1"
        },
        {
            type: "PropertyValue",
            name: "hashId",
            value:
                "fe5b7f0b529dc976de5c990339c27426fac77c36611deb50b8439e9ce573b71c"
        },
        {
            type: "PropertyValue",
            name: "collectionIdentifier",
            value: "AC1"
        },
        {
            type: "PropertyValue",
            name: "doi",
            value: "10.4225/72/56E7A74251D08"
        }
    ]);
});

test("test turning rocrate back in to object - item NT1/98007", async () => {
    let rocrate = await readFile(`${__dirname}/test-data/NT1-98007.json`);
    rocrate = JSON.parse(rocrate);
    rocrate = await dataLoader.objectify({
        rocrate,
        context: "https://schema.org/docs/jsonldcontext.jsonld"
    });
    expect(rocrate.hasPart.length).toBe(45);
    expect(rocrate.identifier).toMatchObject([
        {
            type: "PropertyValue",
            name: "domain",
            value: "paradisec.org.au"
        },
        {
            type: "PropertyValue",
            name: "id",
            value: "paradisec.org.au/NT1/98007"
        },
        {
            type: "PropertyValue",
            name: "hashId",
            value:
                "5390514169b94ccf36c1e2ce1a6b56ea9c5f8a673845d045e5b612c85510168a"
        },
        { type: "PropertyValue", name: "itemIdentifier", value: "98007" },
        {
            type: "PropertyValue",
            name: "collectionIdentifier",
            value: "NT1"
        },
        {
            type: "PropertyValue",
            name: "doi",
            value: "10.4225/72/56F94A61DA9EC"
        }
    ]);
});

test("test parts enrichment in objectified item", async () => {
    let rocrate = await readFile(`${__dirname}/test-data/NT1-98007.json`);
    rocrate = JSON.parse(rocrate);
    rocrate = await dataLoader.objectify({
        rocrate,
        context: "https://schema.org/docs/jsonldcontext.jsonld"
    });

    let inventory = await readFile(
        `${__dirname}/test-data/nt1-98007.inventory.json`
    );
    inventory = JSON.parse(inventory);
    let datafiles = dataLoader.extractObjectDataFiles({ inventory });

    let data = dataLoader.enrichItemParts({
        data: { rocrate, datafiles, path: "/" }
    });
    let parts = orderBy(data.rocrate.hasPart, "id");
    expect(parts[0].displayName).toBe("NT1-98007-001");
    expect(parts[0].path).toBe("/repository/v1/content/NT1-98007-001.jpg");
});

test("test collection member rework", async () => {
    let rocrate = await readFile(`${__dirname}/test-data/AC1.json`);
    rocrate = JSON.parse(rocrate);
    rocrate = await dataLoader.objectify({
        rocrate,
        context: "https://schema.org/docs/jsonldcontext.jsonld"
    });

    let collectionMembers = dataLoader.enrichCollectionMembers({
        collectionMembers: rocrate["http://pcdm.org/models#hasMember"]
    });
    let member = collectionMembers[0];
    expect(member.id).toBe("paradisec.org.au/AC1/000");
    expect(member.url).toBe("/paradisec.org.au/AC1/000");
    expect(member.name).toBe("000");
});

test("test creating item content type data structure - NT1/98007", async () => {
    let rocrate = await readFile(`${__dirname}/test-data/NT1-98007.json`);
    rocrate = JSON.parse(rocrate);
    rocrate = await dataLoader.objectify({
        rocrate,
        context: "https://schema.org/docs/jsonldcontext.jsonld"
    });

    let inventory = await readFile(
        `${__dirname}/test-data/NT1-98007.inventory.json`
    );
    inventory = JSON.parse(inventory);
    let datafiles = dataLoader.extractObjectDataFiles({ inventory });

    let data = dataLoader.enrichItemParts({
        data: { rocrate, datafiles, path: "/" }
    });
    let parts = orderBy(data.rocrate.hasPart, "id");
    parts = dataLoader.constructItemDataStructure({ parts });

    expect(Object.keys(parts.images).length).toBe(31);
    expect(Object.keys(parts.audio).length).toBe(2);
    expect(Object.keys(parts.video).length).toBe(0);
    expect(Object.keys(parts.transcriptions).length).toBe(2);
    expect(parts.transcriptions["NT1-98007-98007A"].length).toBe(3);
});

test("test creating item content type data structure - AC1/001", async () => {
    let rocrate = await readFile(`${__dirname}/test-data/AC1-001.json`);
    rocrate = JSON.parse(rocrate);
    rocrate = await dataLoader.objectify({
        rocrate,
        context: "https://schema.org/docs/jsonldcontext.jsonld"
    });

    let inventory = await readFile(
        `${__dirname}/test-data/AC1-001.inventory.json`
    );
    inventory = JSON.parse(inventory);
    let datafiles = dataLoader.extractObjectDataFiles({ inventory });

    let data = dataLoader.enrichItemParts({
        data: { rocrate, datafiles, path: "/" }
    });
    let parts = orderBy(data.rocrate.hasPart, "id");
    parts = dataLoader.constructItemDataStructure({ parts });

    expect(Object.keys(parts.images).length).toBe(3);
    expect(Object.keys(parts.audio).length).toBe(1);
    expect(Object.keys(parts.video).length).toBe(0);
    expect(Object.keys(parts.transcriptions).length).toBe(0);
});

test("test creating item content type data structure - NT5/TokelauOf", async () => {
    let rocrate = await readFile(`${__dirname}/test-data/NT5-TokelauOf.json`);
    rocrate = JSON.parse(rocrate);
    rocrate = await dataLoader.objectify({
        rocrate,
        context: "https://schema.org/docs/jsonldcontext.jsonld"
    });

    let inventory = await readFile(
        `${__dirname}/test-data/NT5-TokelauOf.inventory.json`
    );
    inventory = JSON.parse(inventory);
    let datafiles = dataLoader.extractObjectDataFiles({ inventory });

    let data = dataLoader.enrichItemParts({
        data: { rocrate, datafiles, path: "/" }
    });
    let parts = orderBy(data.rocrate.hasPart, "id");
    parts = dataLoader.constructItemDataStructure({ parts });

    expect(Object.keys(parts.images).length).toBe(0);
    expect(Object.keys(parts.audio).length).toBe(0);
    expect(Object.keys(parts.video).length).toBe(1);
    expect(Object.keys(parts.transcriptions).length).toBe(1);
    expect(Object.keys(parts.transcriptions["NT5-TokelauOf-vid"]).length).toBe(
        4
    );
});
