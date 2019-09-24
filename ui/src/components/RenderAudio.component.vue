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
        }
    },
    data() {
        return {
            currentTime: 0
        };
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
            this.currentTime = this.$refs.audioElement.currentTime;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-audio-element {
    width: 100%;
}
</style>



