<template>
    <el-card shadow="never" class="my-2">
        <div slot="header" class="text-center">
            <div>{{name}}</div>
        </div>
        <div class="flex flex-col">
            <audio
                ref="mediaElement"
                controls
                class="style-audio-element"
                @timeupdate="notifyTranscription"
            >
                <source :src="audio.path" v-for="(audio, idx2) of item" :key="idx2" />Your browser does not support the
                <code>audio</code> element.
            </audio>
            <render-transcription-selector-component
                v-if="transcriptions && transcriptions.length"
                :transcriptions="transcriptions"
                v-on:load-transcription="loadTranscription"
            />
            <render-transcriptions-component
                v-if="transcriptions && transcriptions.length"
                :transcriptions="transcriptions"
                :current-time="currentTime"
                :selected-transcription="selectedTranscription"
                v-on:play-from="playFrom"
            />
        </div>
    </el-card>
</template>

<script>
import { mixin } from "./RenderMediaMixins";

export default {
    mixins: [mixin]
};
</script>

<style lang="scss" scoped>
.style-audio-element {
    width: 100%;
}
</style>



