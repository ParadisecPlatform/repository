"use strict";

import util from "util";
import fs from "fs-extra";
import { orderBy } from "lodash";
import { DataLoader } from "./data-loader.service";
const dataLoader = new DataLoader();

test.only("test extracting OCFL object versions from inventory.json", async () => {
    let inventory = await fs.readJson(
        `${__dirname}/../test-data/ocfl-inventory-1version.json`
    );
    let versions = dataLoader.getObjectVersions({ inventory });
    expect(versions).toMatchObject([
        { version: "v1", created: "2019-09-16T04:30:29.668Z" }
    ]);

    inventory = await fs.readJson(
        `${__dirname}/../test-data/ocfl-inventory-2versions.json`
    );
    versions = dataLoader.getObjectVersions({ inventory });
    expect(versions).toMatchObject([
        { version: "v1", created: "2019-09-16T04:30:29.668Z" },
        { version: "v2", created: "2019-09-18T04:30:29.668Z" }
    ]);
});

test("test extracting datafiles from OCFL inventory.json", async () => {
    let inventory = await fs.readJson(
        `${__dirname}/../test-data/ocfl-inventory-1version.json`
    );
    let datafiles = dataLoader.extractObjectDataFiles({ inventory });
    expect(datafiles).toMatchObject({
        "item.json": "v1/content/item.json",
        "ro-crate-metadata.jsonld": "v1/content/ro-crate-metadata.jsonld"
    });
});
