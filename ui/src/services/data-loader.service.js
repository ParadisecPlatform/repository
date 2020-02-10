"use strict";

import pairtree from "pairtree";
import shajs from "sha.js";
import jsonld from "jsonld";
import { flattenDeep, isPlainObject, orderBy, groupBy } from "lodash";

import { EAFParser } from "./eaf-parser.service";
import { IXTParser } from "./ixt-parser.service";
import { TRSParser } from "./trs-parser.service";
import { FlextextParser } from "./flextext-parser.service";
import ROCrate from "ro-crate/lib/rocrate";

const parser = {
    eaf: new EAFParser(),
    ixt: new IXTParser(),
    trs: new TRSParser(),
    flextext: new FlextextParser()
};

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
            images:
                crate.hasPart.filter(f =>
                    configuration.imageFormats.includes(f.encodingFormat)
                ).length > 0,
            audio:
                crate.hasPart.filter(f =>
                    configuration.audioFormats.includes(f.encodingFormat)
                ).length > 0,
            video:
                crate.hasPart.filter(f =>
                    configuration.videoFormats.includes(f.encodingFormat)
                ).length > 0,
            documents:
                crate.hasPart.filter(f =>
                    configuration.documentFileExtensions.includes(
                        f.name.split(".").pop()
                    )
                ).length > 0,
            xmlFiles:
                crate.hasPart.filter(
                    f => f.encodingFormat === "application/xml"
                ).length > 0
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
        let xml = await response.text();
        xml = this.parseXML(xml);
        if (!xml) return [];
        transcription = this.convertXmlToJson(xml);
        let segments = parser[type].parse(transcription);
        segments = segments.map(segment => {
            return {
                ...segment,
                htmlId: `s${this.hash(segment.id)}`
            };
        });
        return { type, segments };
    }

    parseXML(src) {
        /* returns an XMLDocument, or null if `src` is malformed */

        let key = `a` + Math.random().toString(32);

        let parser = new DOMParser();

        let doc = null;
        try {
            doc = parser.parseFromString(src + `<?${key}?>`, `application/xml`);
        } catch (_) {}

        if (!(doc instanceof XMLDocument)) {
            return null;
        }

        let lastNode = doc.lastChild;
        if (
            !(lastNode instanceof ProcessingInstruction) ||
            lastNode.target !== key ||
            lastNode.data !== ``
        ) {
            return null;
        }

        doc.removeChild(lastNode);

        let errElemCount = doc.documentElement.getElementsByTagName(
            `parsererror`
        ).length;
        if (errElemCount !== 0) {
            let errDoc = null;
            try {
                errDoc = parser.parseFromString(src + `<?`, `application/xml`);
            } catch (_) {}

            if (
                !(errDoc instanceof XMLDocument) ||
                errDoc.documentElement.getElementsByTagName(`parsererror`)
                    .length === errElemCount
            ) {
                return null;
            }
        }

        return doc;
    }

    convertXmlToJson(xml) {
        // http://davidwalsh.name/convert-xml-json
        // Changes XML to JSON
        // Create the return object
        var obj = {};

        if (xml.nodeType === 1) {
            // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] =
                        attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) {
            // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof obj[nodeName] === "undefined") {
                    obj[nodeName] = this.convertXmlToJson(item);
                } else {
                    if (typeof obj[nodeName].push === "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.convertXmlToJson(item));
                }
            }
        }
        return obj;
    }
}
