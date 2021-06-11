<template>
    <div class="flex flex-col lg:flex-row">
        <div
            class="w-full flex flex-col p-4"
            :class="{ 'lg:w-2/5': transcriptions && transcriptions.length }"
        >
            <audio
                ref="mediaElement"
                controls
                class="block w-full"
                @timeupdate="notifyTranscription"
            >
                <source :src="item.path" v-for="item of items" :key="item.path" />
                Your browser does not support the <code>audio</code> element.
            </audio>
            <render-transcription-selector-component
                v-if="transcriptions && transcriptions.length"
                :transcriptions="transcriptions"
                v-on:load-transcription="loadTranscription"
            />
        </div>
        <div
            class="w-full border-l border-gray-300"
            :class="{ 'lg:w-3/5': transcriptions && transcriptions.length }"
            v-if="transcriptions && transcriptions.length"
        >
            <render-transcriptions-component
                :transcriptions="transcriptions"
                :current-time="currentTime"
                :selected-transcription="selectedTranscription"
                v-on:play-from="playFrom"
            />
        </div>
    </div>
</template>

<script>
import { mixin } from "../RenderMediaMixins";

export default {
    mixins: [mixin],
};
</script>

<style lang="scss" scoped></style>
