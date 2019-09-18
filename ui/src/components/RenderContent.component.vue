<template>
    <div class="flex flex-row">
        <render-images-component :items="item.images" class="w-1/2 px-2 m-3" />
        <div class="flex flex-col w-1/2 px-2">
            <render-audio-component
                v-for="(item, name, idx) of item.audio"
                :key="idx"
                :item="item"
                :name="name"
                class="m-3"
            />
            <render-video-component :items="item.video" />
        </div>
    </div>
</template>

<script>
import { groupBy, map } from "lodash";
import RenderAudioComponent from "./RenderAudio.component.vue";
import RenderVideoComponent from "./RenderVideo.component.vue";
import RenderImagesComponent from "./RenderImages.component.vue";

export default {
    components: {
        RenderAudioComponent,
        RenderVideoComponent,
        RenderImagesComponent
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            items: {
                audio: [],
                video: []
            }
        };
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
</style>