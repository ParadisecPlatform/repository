"use strict";

import pairtree from "pairtree";
import shajs from "sha.js";
import jsonld from "jsonld";
import { flattenDeep, isPlainObject, orderBy, groupBy } from "lodash";

import { Parser } from "transcription-parsers";
import ROCrate from "ro-crate/lib/rocrate";

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
            path
        };

        ocflObject.version = version
            ? versions.filter(v => v.version === version)[0].version
            : [...versions].pop().version;

        let rocrateMetadataFile = [
            ...ocflObject.datafiles["ro-crate-metadata.jsonld"]
        ].pop();
        response = await fetch(rocrateMetadataFile.path);
        if (!response.ok) throw response;
        ocflObject.flattenedCrate = await response.json();

        const crate = new ROCrate(ocflObject.flattenedCrate);
        await crate.objectify();
        ocflObject.objectifiedCrate = await jsonld.compact(
            crate.objectified,
            {},
            {
                base: null,
                // compactArrays: false,
                compactToRelative: true,
                skipExpansion: true
            }
        );

        const ensureArray = ["hasPart", "contributor"];
        for (let item of ensureArray) {
            if (isPlainObject(ocflObject.objectifiedCrate[item]))
                ocflObject.objectifiedCrate[item] = [
                    ocflObject.objectifiedCrate[item]
                ];
        }

        ocflObject.domain = ocflObject.objectifiedCrate.identifier.filter(
            i => i.name === "domain"
        )[0].value;
        ocflObject.type = [
            ...[ocflObject.objectifiedCrate.additionalType],
            ...[ocflObject.objectifiedCrate["@type"]]
        ];
        ocflObject.type = flattenDeep(ocflObject.type);

        ocflObject.dataTypes = this.determineDataTypes({
            crate: ocflObject.objectifiedCrate,
            configuration
        });

        return ocflObject;
    }

    hash(identifier) {
        return shajs("sha512")
            .update(identifier)
            .digest("hex");
    }

    getObjectVersions({ inventory }) {
        const versions = Object.keys(inventory.versions).map(version => {
            return {
                version,
                created: inventory.versions[version].created
            };
        });
        return orderBy(versions, v => parseInt(v.version.replace("v", "")));
    }

    extractObjectDataFiles({ inventory, path }) {
        let files = [];
        for (let hash in inventory.manifest) {
            let items = inventory.manifest[hash];
            files.push(
                items.map(item => {
                    return {
                        name: item.split("/").pop(),
                        path: `${this.repository}${path}${item}`,
                        hash,
                        version: parseInt(
                            item
                                .split("/")
                                .shift()
                                .replace("v", "")
                        )
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

    determineDataTypes({ configuration, crate }) {
        if (!crate.hasPart) return {};
        let types = {
            images: crate.hasPart
                .filter(f =>
                    configuration.imageFormats.includes(f.encodingFormat)
                )
                .map(i => i.name),
            audio: crate.hasPart
                .filter(f =>
                    configuration.audioFormats.includes(f.encodingFormat)
                )
                .map(a => a.name),
            video: crate.hasPart
                .filter(f =>
                    configuration.videoFormats.includes(f.encodingFormat)
                )
                .map(v => v.name),
            documents: crate.hasPart
                .filter(f =>
                    configuration.documentFileExtensions.includes(
                        f.name.split(".").pop()
                    )
                )
                .map(d => d.name),
            xmlFiles: crate.hasPart
                .filter(f => f.encodingFormat === "application/xml")
                .map(x => x.name)
        };
        return types;
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
        let parser = new Parser({
            name: transcription.name,
            data: xmlString
        });
        let result = await parser.parse();
        return result;
    }
}
