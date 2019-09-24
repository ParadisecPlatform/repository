<template>
    <el-card shadow="never" class="my-2">
        <div slot="header" class="text-center">
            <div>{{name}}</div>
        </div>
        <div class="flex flex-col">
            <audio
                ref="audioElement"
                controls
                class="style-audio-element"
                @timeupdate="notifyTranscription"
            >
                <source :src="audio.path" v-for="(audio, idx2) of item" :key="idx2" />Your browser does not support the
                <code>audio</code> element.
            </audio>
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
            type: Array | undefined,
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
        this.watchers.isActive = this.$watch("isActive", this.stopAudio);
    },
    beforeDestroy() {
        this.watchers.isActive();
    },
    methods: {
        playFrom({ start, end }) {
            this.$refs.audioElement.currentTime = start;
            this.$refs.audioElement.play();
            setTimeout(() => {
                this.$refs.audioElement.pause();
            }, (end - start) * 1000);
        },
        notifyTranscription(time) {
            if (this.$refs.audioElement)
                this.currentTime = this.$refs.audioElement.currentTime;
        },
        stopAudio() {
            if (!this.isActive) this.$refs.audioElement.pause();
        }
    }
};
</script>

<style lang="scss" scoped>
.style-audio-element {
    width: 100%;
}
</style>



