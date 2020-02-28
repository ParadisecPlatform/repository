<template>
    <div class="flex flex-col">
        <div class="flex flex-row my-2">
            <div class="mx-2">
                <render-play-segment-control :item="item" />
            </div>
            <div class="leading-loose text-base">{{ item.segment.text }}</div>
        </div>
        <div class="flex-grow">
            <router-link :to="{ path: constructIdentifier({ segment: item.segment }) }">
                <div class="text-xs">{{ constructIdentifier({ segment: item.segment }) }}</div>
            </router-link>
        </div>
    </div>
</template>

<script>
import RenderPlaySegmentControl from "./RenderPlaySegmentControl.component.vue";

export default {
    components: {
        RenderPlaySegmentControl
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            descriptionMaxLength: 200
        };
    },
    methods: {
        constructIdentifier({ segment }) {
            const domain = this.$store.state.configuration.domain;
            let identifier = segment.identifier;
            if (domain) {
                identifier = identifier.replace(`/${domain}/`, "/view/");
            }
            identifier = `${identifier}?transcription=${segment.file}&begin=${segment.timeBegin}&end=${segment.timeEnd}`;
            return identifier;
        }
    }
};
</script>

<style lang="scss" scoped></style>
