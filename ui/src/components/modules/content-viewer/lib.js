import { CrateManager } from "@/crate-manager.js";
import { computed } from "vue";

export function getFilesByEncoding({ formats, crate }) {
    crate = new CrateManager({ crate });
    let rootDataset = crate.getRootDataset();
    let parts = rootDataset.hasPart
        .map((file) => crate.getEntity({ id: file["@id"] }))
        .filter((file) => formats.includes(file.encodingFormat));
    return parts;
}

export function getFilesByName({ formats, crate }) {
    crate = new CrateManager({ crate });
    let rootDataset = crate.getRootDataset();
    let parts = rootDataset.hasPart
        .filter((file) => {
            return formats.includes(file["@id"].split(".").pop());
        })
        .map((file) => crate.getEntity({ id: file["@id"] }));
    return parts;
}
export function categoriseItemContent({ crate, formats }) {
    let enable = {
        images: [],
        audio: [],
        video: [],
        documents: [],
        xml: [],
    };
    crate = new CrateManager({ crate });
    let rootDataset = crate.getRootDataset();
    for (let part of rootDataset.hasPart) {
        let entity = crate.getEntity({ id: part["@id"] });
        if (formats.images.includes(entity.encodingFormat)) {
            enable.images.push(part);
        }
        if (formats.audio.includes(entity.encodingFormat)) {
            enable.audio.push(part);
        }
        if (formats.video.includes(entity.encodingFormat)) {
            enable.video.push(part);
        }
        if (formats.documents.includes(entity["@id"].split(".").pop())) {
            enable.documents.push(part);
        }
        if (formats.xml.includes(part)) {
            enable.xml.push(part);
        }
    }
    return enable;
}

export async function getPresignedUrl({ $http, $route, filename }) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const { collectionId, itemId } = $route.params;
    let response;
    if (collectionId && itemId) {
        response = await $http.get({
            route: `/collections/${collectionId}/items/${itemId}/pre-signed-url/${filename}`,
        });
    } else if (itemId && !collectionId) {
        response = await $http.get({ route: `/items/${itemId}/pre-signed-url/${filename}` });
    }
    if (response.status === 200) {
        return (await response.json()).url;
    }
    throw new Error(`Unable to get link to ${filename} in storage`);
}

export async function getFile({ $http, $route, filename }) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const { collectionId, itemId } = $route.params;
    let response;
    if (collectionId && itemId) {
        response = await $http.get({
            route: `/collections/${collectionId}/items/${itemId}/file/${filename}`,
        });
    } else if (itemId && !collectionId) {
        response = await $http.get({ route: `/items/${itemId}/file/${filename}` });
    }
    if (response.status === 200) {
        let { content } = await response.json();
        return { content };
    } else {
        throw new Error({ code: response.status });
    }
}

export async function loadTranscription({ $http, $route, filename }) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const { collectionId, itemId } = $route.params;
    let response;
    if (collectionId && itemId) {
        response = await $http.get({
            route: `/collections/${collectionId}/items/${itemId}/transcription/${filename}`,
        });
    } else if (itemId && !collectionId) {
        response = await $http.get({ route: `/items/${itemId}/transcription/${filename}` });
    }
    if (response.status === 200) {
        let { transcription } = await response.json();
        return { transcription };
    } else {
        throw new Error({ code: response.status });
    }
}

export let panelHeight = computed(() => {
    let subtract = window.innerWidth > 1024 ? 300 : 450;
    return `${window.innerHeight - subtract}px`;
});
