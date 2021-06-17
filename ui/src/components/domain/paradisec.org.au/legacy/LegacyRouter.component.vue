<template>
    <div></div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
import { getFilesByName, getFilesByEncoding } from "components/shared/media-player/lib";
const dataLoader = new DataLoader();

export default {
    data() {
        return {};
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            const collectionId = this.$route.params.collectionId;
            const itemId = this.$route.params.itemId;
            const essenceId = this.$route.params.essenceId;
            if (collectionId && !itemId && !essenceId) {
                this.$router.push({ path: `/view/${collectionId}` });
            } else if (collectionId && itemId && !essenceId) {
                this.$router.push({ path: `/view/${collectionId}/${itemId}` });
            } else if (collectionId && itemId && essenceId) {
                let params = {
                    identifier: `/paradisec.org.au/${collectionId}/${itemId}`,
                    version: undefined,
                    configuration: this.$store.state.configuration,
                };

                this.ocflObject = await dataLoader.load({ ...params });
                let essence = this.ocflObject.rocrate["@graph"].filter(
                    (i) => i.essenceId == essenceId
                )[0];
                if (essence?.essenceId) {
                    const configuration = this.$store.state.configuration;
                    let type, hash;
                    if (configuration.imageFormats.includes(essence.encodingFormat)) {
                        type = "image";
                        hash = essence.name;
                    } else if (configuration.audioFormats.includes(essence.encodingFormat)) {
                        type = "audio";
                        hash = essence.name.split(".").shift();
                    } else if (configuration.videoFormats.includes(essence.encodingFormat)) {
                        type = "video";
                        hash = essence.name.split(".").shift();
                    } else if (
                        configuration.documentFileExtensions.includes(essence.name.split(".").pop())
                    ) {
                        type = "document";
                        hash = essence.name;
                    } else if (
                        configuration.transcriptionFileExtensions.includes(
                            essence.name.split(".").pop()
                        )
                    ) {
                        type = "xml";
                        hash = essence.name;
                    }
                    this.$router.push({
                        path: `/view/${collectionId}/${itemId}`,
                        query: { type },
                        hash: `#${hash}`,
                    });
                } else {
                    this.$router.push({
                        path: `/view/${collectionId}/${itemId}`,
                    });
                }
            }
        },
    },
};
</script>
