"use strict";

import pairtree from "pairtree";
import shajs from "sha.js";
import { flattenDeep, orderBy, groupBy } from "lodash";

// import { Parser } from "@coedl/transcription-parsers";
// import Worker from "src/components/workers/transcript-parser.worker.js";

export class DataLoader {
    constructor() {
        this.repository = "/repository";
        this.ocflRootDescriptor = "0=ocfl_1.0";
        this.configuration = {
            domain: "",
            service: {
                search: "http://localhost:8000/search",
                api: "http://localhost:8000",
            },
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
        let response = await fetch(`${this.repository}/${this.ocflRootDescriptor}`);
        if (response.status !== 200) {
            console.log("Error: the OCFL filesystem does not seem to be mounted.");
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
                console.log("Error: the Search endpoint does not seem to be available.");
                return false;
            }
            return true;
        } catch (error) {
            console.log("Error: the Search endpoint does not seem to be available.");
            return false;
        }
    }

    async load({ identifier, version, configuration }) {
        identifier = this.hash(identifier);
        let path = pairtree.path(identifier);
        // always get latest inventory and extract versions
        let inventoryPath = `${this.repository}${path}inventory.json`;
        let response = await fetch(inventoryPath);
        if (!response.ok) throw response;

        let inventory = await response.json();
        const versions = this.getObjectVersions({ inventory });

        // if requesting specific version - get that and load the rest
        if (version) {
            inventoryPath = `${this.repository}${path}${version}/inventory.json`;
            let response = await fetch(inventoryPath);
            if (!response.ok) throw response;
            inventory = await response.json();
        }
        let ocflObject = {
            inventory,
            versions,
            datafiles: this.extractObjectDataFiles({ inventory, path }),
            path,
        };

        ocflObject.version = version
            ? versions.filter((v) => v.version === version)[0].version
            : [...versions].pop().version;

        let rocrateMetadataFile;
        try {
            rocrateMetadataFile = [...ocflObject.datafiles["ro-crate-metadata.json"]].pop();
        } catch (error) {
            rocrateMetadataFile = [...ocflObject.datafiles["ro-crate-metadata.jsonld"]].pop();
        }
        response = await fetch(rocrateMetadataFile.path);
        if (!response.ok) throw response;
        ocflObject.rocrate = await response.json();

        const rootDescriptor = ocflObject.rocrate["@graph"].filter(
            (e) => e["@type"] === "CreativeWork" && e["@id"] === "ro-crate-metadata.json"
        )[0];
        const rootDataset = ocflObject.rocrate["@graph"].filter(
            (e) => e["@type"].includes("Dataset") && e["@id"] === rootDescriptor.about["@id"]
        )[0];

        let identifiers = rootDataset.identifier
            .map((e) => e["@id"])
            .map((id) => ocflObject.rocrate["@graph"].filter((e) => e["@id"] === id));
        identifiers = flattenDeep(identifiers);
        ocflObject.domain = identifiers.filter((i) => i.name === "domain")[0].value;
        ocflObject.type = flattenDeep([...[rootDataset["@type"]], ...[rootDataset.additionalType]]);
        // ocflObject.dataTypes = this.determineDataTypes({
        //     crate: ocflObject.rocrate,
        //     configuration,
        // });

        return ocflObject;
    }

    hash(identifier) {
        return shajs("sha512").update(identifier).digest("hex");
    }

    getObjectVersions({ inventory }) {
        const versions = Object.keys(inventory.versions).map((version) => {
            return {
                version,
                created: inventory.versions[version].created,
            };
        });
        return orderBy(versions, (v) => parseInt(v.version.replace("v", "")));
    }

    extractObjectDataFiles({ inventory, path }) {
        let files = [];
        for (let hash in inventory.manifest) {
            let items = inventory.manifest[hash];
            files.push(
                items.map((item) => {
                    return {
                        name: item.split("/").pop(),
                        path: `${this.repository}${path}${item}`,
                        hash,
                        version: item.split("/").shift(),
                    };
                })
            );
        }
        files = flattenDeep(files);
        files = groupBy(files, "name");
        for (let file of Object.keys(files)) {
            files[file] = orderBy(files[file], "version");
        }

        return files;
    }

    async loadFile({ file }) {
        let response = await fetch(file.path);
        if (!response.ok) throw response;
        return await response.text();
    }

    async loadTranscription({ transcription }) {
        const type = transcription.name.split(".").pop();
        let response = await fetch(transcription.path);
        if (!response.ok) throw response;
        let xmlString = await response.text();
        return new Promise((resolve) => {
            const worker = new Worker();
            worker.postMessage({ name: transcription.name, xmlString });
            worker.addEventListener("message", (m) => resolve(m.data));
        });
    }
}

export function determineDataTypes({ configuration, crate }) {
    let types = {
        images: crate["@graph"]
            .filter((e) => e["@type"] === "File")
            .filter((f) => configuration.imageFormats.includes(f.encodingFormat))
            .map((i) => i.name),
        audio: crate["@graph"]
            .filter((e) => e["@type"] === "File")
            .filter((f) => configuration.audioFormats.includes(f.encodingFormat))
            .map((a) => a.name),
        video: crate["@graph"]
            .filter((e) => e["@type"] === "File")
            .filter((f) => configuration.videoFormats.includes(f.encodingFormat))
            .map((v) => v.name),
        documents: crate["@graph"]
            .filter((e) => e["@type"] === "File")
            .filter((f) => configuration.documentFileExtensions.includes(f.name.split(".").pop()))
            .map((d) => d.name),
        xmlFiles: crate["@graph"]
            .filter((e) => e["@type"] === "File")
            .filter((f) => f.encodingFormat === "application/xml")
            .map((x) => x.name),
    };
    return types;
}
