"use strict";

import RenderTranscriptionsComponent from "./RenderTranscriptions.component.vue";
import RenderTranscriptionSelectorComponent from "./RenderTranscriptionSelector.component.vue";

export let mixin = {
    components: {
        RenderTranscriptionsComponent,
        RenderTranscriptionSelectorComponent
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
            currentTime: 0,
            selectedTranscription: undefined
        };
    },
    mounted() {
        this.watchers.isActive = this.$watch("isActive", this.stopVideo);
        this.selectedTranscription =
            this.transcriptions && this.transcriptions.length
                ? this.transcriptions[0]
                : undefined;
    },
    beforeDestroy() {
        this.watchers.isActive();
    },
    methods: {
        playFrom({ start, end }) {
            this.$refs.mediaElement.currentTime = start;
            this.$refs.mediaElement.play();
            setTimeout(() => {
                this.$refs.mediaElement.pause();
            }, (end - start) * 1000);
        },
        notifyTranscription(time) {
            if (this.$refs.mediaElement)
                this.currentTime = this.$refs.mediaElement.currentTime;
        },
        stopVideo() {
            if (!this.isActive) this.$refs.mediaElement.pause();
        },
        loadTranscription(transcription) {
            this.selectedTranscription = transcription;
        }
    }
};
