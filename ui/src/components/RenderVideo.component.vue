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
        },
        isActive: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            watchers: {},
            currentTime: 0
        };
    },
    mounted() {
        this.watchers.isActive = this.$watch("isActive", this.stopVideo);
    },
    beforeDestroy() {
        this.watchers.isActive();
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
            if (this.$refs.videoElement)
                this.currentTime = this.$refs.videoElement.currentTime;
        },
        stopVideo() {
            if (!this.isActive) this.$refs.videoElement.pause();
        }
    }
};
</script>

<style lang="scss" scoped>
.style-video-element {
    min-width: 500px;
    width: 100%;
}
</style>w



