<template>
    <div class="flex flex-col">
        <div class="flex flex-row my-2">
            <div class="mx-2">
                <render-play-segment-control :item="item._source" />
            </div>
            <div class="leading-loose text-base">{{ item._source.text }}</div>
        </div>
        <div class="flex-grow flex flex-row">
            <router-link :to="{ path: constructIdentifier({ segment: item._source }) }">
                <div class="text-xs">{{ constructIdentifier({ segment: item._source }) }}</div>
            </router-link>
            <div class="flex-grow"></div>
            <copy-to-clipboard-component :data="location" type="copy" />
        </div>
    </div>
</template>

<script>
import RenderPlaySegmentControl from "./RenderPlaySegmentControl.component.vue";
import CopyToClipboardComponent from "components/shared/CopyToClipboard.component.vue";

export default {
    components: {
        RenderPlaySegmentControl,
        CopyToClipboardComponent,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            descriptionMaxLength: 200,
        };
    },
    computed: {
        location() {
            return window.location;
        },
    },
    methods: {
        constructIdentifier({ segment }) {
            const domain = this.$store.state.configuration.domain;
            let identifier = segment.resource;
            if (domain) {
                identifier = identifier.replace(`/${domain}/`, "/view/");
            }
            identifier = `${identifier}?transcription=${segment.file}&begin=${
                segment.timeBegin
            }&end=${segment.timeEnd}#${segment.file.split(".").shift()}`;
            return identifier;
        },
    },
};
</script>

<style lang="scss" scoped></style>
