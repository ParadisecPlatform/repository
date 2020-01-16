"use strict";

import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();

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
        }
    },
    data() {
        return {
            currentTime: 0,
            selectedTranscription: undefined
        };
    },
    mounted() {
        this.selectedTranscription =
            this.transcriptions && this.transcriptions.length
                ? this.transcriptions[0]
                : undefined;
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
        async loadTranscription(transcription) {
            this.selectedTranscription = transcription;
        }
    }
};
