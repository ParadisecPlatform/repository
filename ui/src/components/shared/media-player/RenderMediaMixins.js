"use strict";

import { DataLoader } from "src/services/data-loader.service";
// const dataLoader = new DataLoader();

import RenderTranscriptionsComponent from "./transcription-viewers/RenderTranscriptions.component.vue";
import RenderTranscriptionSelectorComponent from "./transcription-viewers/RenderTranscriptionSelector.component.vue";

export let mixin = {
    components: {
        RenderTranscriptionsComponent,
        RenderTranscriptionSelectorComponent,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        transcriptions: {
            type: Array | undefined,
            required: true,
        },
    },
    data() {
        return {
            currentTime: 0,
            selectedTranscription: undefined,
        };
    },
    mounted() {
        this.selectedTranscription =
            this.transcriptions && this.transcriptions.length ? this.transcriptions[0] : undefined;
        if (this.$route.query.transcription) {
            setTimeout(() => {
                this.playFrom({
                    start: this.$route.query.begin,
                    end: this.$route.query.end,
                });
            }, 3000);
        }
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
            if (this.$refs.mediaElement) this.currentTime = this.$refs.mediaElement.currentTime;
        },
        async loadTranscription(transcription) {
            this.selectedTranscription = transcription;
        },
    },
};
