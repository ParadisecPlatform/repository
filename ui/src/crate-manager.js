import { groupBy } from "lodash";
export class CrateManager {
    constructor({ crate }) {
        this.crate = crate;
        this.rootDescriptor = this.crate["@graph"].filter(
            (e) => e["@type"] === "CreativeWork" && e["@id"] === "ro-crate-metadata.json"
        )[0];
        this.rootDataset = this.crate["@graph"].filter(
            (e) => e["@id"] === this.rootDescriptor.about["@id"]
        )[0];

        this.entitiesById = groupBy(crate["@graph"], "@id");
    }

    getRootDataset() {
        return this.rootDataset;
    }

    getEntity({ id }) {
        return this.entitiesById[id][0];
    }
}
