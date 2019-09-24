<template>
    <el-card shadow="never" class="my-2">
        <div slot="header" class="text-center">
            <div>{{name}}</div>
        </div>
        <div class="flex flex-row">
            <div class="mx-4">
                <video
                    controls
                    ref="videoElement"
                    class="style-video-element"
                    @timeupdate="notifyTranscription"
                >
                    <source :src="video.path" v-for="(video, idx2) of item" :key="idx2" />Your browser does not support the
                    <code>video</code> element.
                </video>
            </div>
            <render-transcriptions-component
                v-if="transcriptions"
                :transcriptions="transcriptions"
                :current-time="currentTime"
                v-on:playFrom="playFrom"
            />
        </div>
    </el-card>
</template>

<script>
import RenderTranscriptionsComponent from "./RenderTranscriptions.component.vue";

export default {
    components: {
        RenderTranscriptionsComponent
    },
    props: {
        name: {
            type: String,
            required: true
        },
        item: {
            type: Array,
            required: true
        },
        transcriptions: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            currentTime: 0
        };
    },
    methods: {
        playFrom({ start, end }) {
            this.$refs.videoElement.currentTime = start;
            this.$refs.videoElement.play();
            setTimeout(() => {
                this.$refs.videoElement.pause();
            }, (end - start) * 1000);
        },
        notifyTranscription(time) {
            this.currentTime = this.$refs.videoElement.currentTime;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-video-element {
    min-width: 500px;
    width: 100%;
}
</style>



