<template>
    <div>
        <render-audio-component :items="items.audio" />
        <render-video-component :items="items.video" />
    </div>
</template>

<script>
import { groupBy, map } from "lodash";
import RenderAudioComponent from "./RenderAudio.component.vue";
import RenderVideoComponent from "./RenderVideo.component.vue";

export default {
    components: {
        RenderAudioComponent,
        RenderVideoComponent
    },
    props: {
        content: {
            type: Array,
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
    mounted() {
        let datatypes = groupBy(this.content, item => item.displayName);

        for (let filename of Object.keys(datatypes)) {
            let items = datatypes[filename];
            if (items[0].type === "audio") {
                this.items.audio.push(datatypes[filename]);
            } else if (items[0].type === "video") {
                this.items.video.push(datatypes[filename]);
            }
        }
        // console.log(datatypes, null, 2);
    }
};
</script>

<style lang="scss" scoped>
</style>