<template>
    <div class="flex flex-row">
        <render-images-component :items="item.images" class="w-1/2 px-2" />
        <div class="flex flex-col w-1/2 px-2">
            <render-audio-component :items="item.audio" />
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