"use strict";

import pairtree from "pairtree";
import shajs from "sha.js";
import jsonld from "jsonld";
import { map, isArray, isObject } from "lodash";

const typeMappings = {
    "audio/x-wav": "audio",
    "audio/mpeg": "audio"
};

const maintainIds = [
    "http://pcdm.org/models#hasMember",
    "http://schema.org/memberOf"
];

export class DataLoader {
    constructor() {
        this.repository = "/repository";
        this.ocflRootDescriptor = "0=ocfl_1.0";
        this.configuration = {
            domain: "",
            service: {
                search: "http://localhost:8000/search",
                api: "http://localhost:8000"
            }
        };
    }

    async getConfiguration() {
        let response = await fetch(`/configuration.json`);
        let configuration = { ...this.configuration };
        if (response.status === 200) {
            configuration = await response.json();
            configuration = { ...this.configuration, ...configuration };
        }
        return configuration;
    }

    async verifyRepositoryMounted() {
        let response = await fetch(
            `${this.repository}/${this.ocflRootDescriptor}`
        );
        if (response.status !== 200) {
            console.log(
                "Error: the OCFL filesystem does not seem to be mounted."
            );
            return false;
        }
        return true;
    }

    async verifyApiServiceAvailable(service) {
        try {
            let response = await fetch(`${service}/health-check`);
            if (response.status !== 200) {
                console.log("Error: the API does not seem to be available.");
                return false;
            }
            return true;
        } catch (error) {
            console.log("Error: the API does not seem to be available.");
            return false;
        }
    }

    async verifySearchServiceAvailable({ service }) {
        try {
            let response = await fetch(`${service}/_search?size=0`);
            // do nothing for now
            if (response.status !== 200) {
                console.log(
                    "Error: the Search endpoint does not seem to be available."
                );
                return false;
            }
            return true;
        } catch (error) {
            console.log(
                "Error: the Search endpoint does not seem to be available."
            );
            return false;
        }
    }

    async loadCollection({ domain, collectionId }) {
        const identifier = this.hash(`${domain}/${collectionId}`);
        return await this.load({ identifier });
    }

    async loadItem({ domain, collectionId, itemId }) {
        const identifier = this.hash(`${domain}/${collectionId}/${itemId}`);
        let data = await this.load({ identifier });
        data.rocrate.hasPart = data.rocrate.hasPart.map(file => {
            file["type"] = typeMappings[file.encodingFormat];
            file["displayName"] = file.name.split(".").slice(0, -1)[0];
            file.path = `/repository${data.path}${data.datafiles[file.name]}`;
            return file;
        });
        return data;
    }

    async load({ identifier }) {
        const path = pairtree.path(identifier);
        let response = await fetch(`${this.repository}${path}inventory.json`);
        if (response.status !== 200) {
            return {};
        }
        let inventory = await response.json();
        let datafiles = this.extractObjectDataFiles({ inventory });

        response = await fetch(
            `${this.repository}${path}${datafiles["ro-crate-metadata.jsonld"]}`
        );
        if (response.status !== 200) {
            return {};
        }
        let rocrate = await response.json();
        rocrate = await this.objectify({ rocrate });
        return { inventory, rocrate, datafiles, path };
    }

    hash(identifier) {
        return shajs("sha256")
            .update(identifier)
            .digest("hex");
    }

    extractObjectDataFiles({ inventory }) {
        const versions = Object.keys(inventory.versions)
            .map(v => parseInt(v.replace("v", "")))
            .sort();
        let datafiles = {};
        versions.forEach(version => {
            let files = inventory.versions[`v${version}`];
            files = Object.entries(files.state);
            for (let file of files) {
                file[1].forEach(f => {
                    datafiles[f] = `v${version}/content/${f}`;
                });
            }
        });
        return datafiles;
    }

    async objectify({ rocrate }) {
        let data = (await jsonld.expand(rocrate))[0]["@graph"];

        let objectRoot = data.filter(e => e["@id"] === "./")[0];
        let content = data.filter(e => e["@id"] !== "./");

        let root = {};
        map(objectRoot, (values, rootElement) => {
            if (isArray(values)) {
                values = values.map(v => {
                    if (isObject(v) && v["@id"]) {
                        let element = content.filter(
                            c => c["@id"] === v["@id"]
                        )[0];
                        if (!maintainIds.includes(rootElement)) delete v["@id"];
                        if (element) delete element["@id"];
                        v = { ...v, ...element };
                    }
                    return v;
                });
            }
            root[rootElement] = values;
        });
        return await jsonld.compact(root, {
            "@context": "http://schema.org"
        });
    }
}
