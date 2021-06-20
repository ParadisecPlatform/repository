import { flattenDeep } from "lodash";

export function populate(crate, item, properties) {
    for (let property of properties) {
        item[property] = flattenDeep([item[property]]).map((linkedItem) =>
            crate.getItem(linkedItem["@id"])
        );
    }
    return item;
}

export function contributorDisplayName(contributor) {
    let name = "";
    if (contributor.givenName) name += contributor.givenName;
    if (contributor.familyName) name += ` ${contributor.familyName}`;
    return `${name} - ${contributor.role.map((r) => r.name).join(", ")}`;
}
