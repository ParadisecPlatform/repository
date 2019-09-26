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
            currentTime: 0,
            selectedTranscription: this.transcriptions[0]
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
            if (!this.isActive) this.$refs.medialement.pause();
        },
        loadTranscription(transcription) {
            this.selectedTranscription = transcription;
        }
    }
};
