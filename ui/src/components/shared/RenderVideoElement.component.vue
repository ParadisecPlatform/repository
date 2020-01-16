<template>
    <el-card shadow="never" class="my-2">
        <div slot="header" class="text-center">
            <div>{{name}}</div>
        </div>
        <div class="flex flex-col lg:flex-row">
            <div
                class="w-full mx-2 flex flex-col"
                :class="{ 'lg:w-1/2': transcriptions && transcriptions.length}"
            >
                <video
                    controls
                    ref="mediaElement"
                    class="style-video-element"
                    @timeupdate="notifyTranscription"
                >
                    <source :src="video.path" v-for="(video, idx2) of item" :key="idx2" />Your browser does not support the
                    <code>video</code> element.
                </video>
                <render-transcription-selector-component
                    v-if="transcriptions && transcriptions.length"
                    :transcriptions="transcriptions"
                    layout="column"
                    v-on:load-transcription="loadTranscription"
                />
            </div>
            <div class="w-full lg:w-1/2" v-if="transcriptions && transcriptions.length">
                <render-transcriptions-component
                    :transcriptions="transcriptions"
                    :current-time="currentTime"
                    :selected-transcription="selectedTranscription"
                    v-on:play-from="playFrom"
                />
            </div>
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
.style-video-element {
    width: 100%;
}
</style>



