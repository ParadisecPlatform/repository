"use strict";

import pairtree from "pairtree";
import shajs from "sha.js";
import jsonld from "jsonld";
import {
    map,
    isArray,
    isObject,
    isPlainObject,
    orderBy,
    groupBy,
    trimStart
} from "lodash";

import { EAFParser } from "./eaf-parser.service";
import { IXTParser } from "./ixt-parser.service";
import { TRSParser } from "./trs-parser.service";
import { FlextextParser } from "./flextext-parser.service";

const parser = {
    eaf: new EAFParser(),
    ixt: new IXTParser(),
    trs: new TRSParser(),
    flextext: new FlextextParser()
};

const typeMappings = {
    "image/tiff": "image",
    "image/jpeg": "image",
    "audio/x-wav": "audio",
    "audio/mpeg": "audio",
    "video/quicktime": "video",
    "video/mp4": "video",
    "application/xml": "data"
};

const transcriptionExtensions = ["eaf", "trs", "ixt"];

const displayImageTypes = ["image/jpeg"];

const maintainIds = [
    "http://pcdm.org/models#hasMember",
    "http://schema.org/memberOf",
    "http://schema.org/hasPart"
];

const jsonldContext = `${window.location.origin}/jsonldcontext.jsonld`;
// const jsonldContext = "http://schema.org"

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
        const identifier = `/${domain}/${collectionId}`;
        let data = await this.load({ identifier });
        data.rocrate.collectionMembers = this.enrichCollectionMembers({
            collectionMembers: data.rocrate["http://pcdm.org/models#hasMember"]
        });

        return data;
    }

    async loadItem({ domain, collectionId, itemId }) {
        const identifier = `/${domain}/${collectionId}/${itemId}`;
        let data = await this.load({ identifier });
        if (!data.rocrate) return data;
        data = this.enrichItemParts({ data });
        data.rocrate = {
            ...data.rocrate,
            ...this.constructItemDataStructure({ parts: data.rocrate.hasPart })
        };
        return data;
    }

    async load({ identifier, check = false }) {
        identifier = this.hash(identifier);
        const path = pairtree.path(identifier);
        let response = await fetch(`${this.repository}${path}inventory.json`);
        if (!response.ok) throw response;
        if (check) return true;

        let inventory = await response.json();
        let datafiles = this.extractObjectDataFiles({ inventory });

        response = await fetch(
            `${this.repository}${path}${datafiles["ro-crate-metadata.jsonld"]}`
        );
        if (!response.ok) throw response;

        let flattenedCrate = await response.json();
        let rocrate = await this.objectify({ rocrate: flattenedCrate });
        return { inventory, rocrate, flattenedCrate, datafiles, path };
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

    async objectify({ rocrate, context = null }) {
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
        root = await jsonld.compact(
            root,
            {
                "@context": context ? context : jsonldContext
            },
            {
                base: null,
                // compactArrays: false,
                compactToRelative: true,
                skipExpansion: true
            }
        );
        return root;
    }

    enrichCollectionMembers({ collectionMembers }) {
        let members = collectionMembers;
        members = orderBy(members, "id");
        if (isPlainObject(members)) members = [members];
        members = members.map(member => {
            let name = member.id.split("/");
            return {
                id: member.id,
                name: name[3]
            };
        });
        return members;
    }

    enrichItemParts({ data }) {
        data.rocrate.hasPart = data.rocrate.hasPart.map(file => {
            file.displayName = file.name.split(".").slice(0, -1)[0];
            file.path = `/repository${data.path}${data.datafiles[file.name]}`;

            file.type = typeMappings[file.encodingFormat];
            file.extension = file.name.split(".").pop();
            if (file.type === "data")
                file.type = transcriptionExtensions.includes(
                    file.name.split(".").pop()
                )
                    ? "transcription"
                    : "data";
            return file;
        });
        return data;
    }

    constructItemDataStructure({ parts }) {
        let structure = {
            images: get({ parts, type: "image" }),
            audio: get({ parts, type: "audio" }),
            video: get({ parts, type: "video" }),
            documents: [],
            transcriptions: get({ parts, type: "transcription" })
        };
        structure.images = preprocessImages({ images: structure.images });
        return structure;

        function get({ parts, type }) {
            let images = parts.filter(p => p.type === type);
            images = orderBy(images, "id");
            images = groupBy(images, "displayName");
            return images;
        }

        function preprocessImages({ images }) {
            let names = Object.keys(images);
            for (let name of names) {
                let displayImages = images[name].filter(i => {
                    return displayImageTypes.includes(i.encodingFormat);
                });
                images[name] = {
                    image: displayImages.filter(
                        i => !i.name.match("thumbnail")
                    )[0],
                    thumbnail:
                        displayImages.filter(i =>
                            i.name.match("thumbnail")
                        )[0] || {}
                };
            }
            return images;
        }
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
