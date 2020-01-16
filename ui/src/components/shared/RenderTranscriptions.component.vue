<template>
    <div class="flex flex-col">
        <div :id="transcription.displayName" class="style-transcription">
            <render-transcription-eaf-component
                v-if="transcription.type === 'eaf'"
                :transcription="transcription"
                :current-time="currentTime"
                v-on:play-from="playFrom"
            />

            <render-transcription-eaf-component
                v-if="transcription.type === 'trs'"
                :transcription="transcription"
                :current-time="currentTime"
                v-on:play-from="playFrom"
            />

            <render-transcription-ixt-component
                v-if="transcription.type === 'ixt'"
                :transcription="transcription"
                :current-time="currentTime"
                v-on:play-from="playFrom"
            />

            <div
                v-if="!transcription.segments || !transcription.segments.length"
                class="text-center"
            >
                There was an error loading that file. This is typically due to
                the XML not being well-formed.
            </div>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import RenderTranscriptionEafComponent from "./RenderTranscriptionEAF.component.vue";
import RenderTranscriptionIxtComponent from "./RenderTranscriptionIXT.component.vue";
import RenderTranscriptionTrsComponent from "./RenderTranscriptionTRS.component.vue";

export default {
    components: {
        RenderTranscriptionEafComponent,
        RenderTranscriptionIxtComponent,
        RenderTranscriptionTrsComponent
    },
    props: {
        transcriptions: {
            type: Array | undefined,
            required: true
        },
        selectedTranscription: {
            type: Object | undefined,
            required: true
        },
        currentTime: {
            type: Number
        }
    },
    data() {
        return {
            watchers: {},
            transcription: {
                type: undefined,
                segments: []
            }
        };
    },
    mounted() {
        this.watchers.selectedTranscription = this.$watch(
            "selectedTranscription",
            this.loadTranscription
        );
        this.loadTranscription();
    },
    beforeDestroy() {
        this.watchers.selectedTranscription();
    },
    methods: {
        async loadTranscription() {
            if (!this.selectedTranscription) return;
            let transcription = { ...this.selectedTranscription };
            try {
                this.transcription = {
                    ...transcription,
                    displayName: (transcription.displayName = transcription.name
                        .split(".")
                        .slice(0, -1)
                        .join(".")),
                    ...(await dataLoader.loadTranscription({
                        transcription
                    }))
                };
                setTimeout(() => {
                    this.$scrollTo(`#${transcription.displayName}`, 300, {
                        container: `#${transcription.displayName}`
                    });
                }, 1000);
            } catch (error) {
                console.log(error);
            }
        },
        playFrom({ start, end }) {
            this.$emit("play-from", { start, end });
        }
    }
};
</script>

<style lang="scss" scoped>
.style-transcription {
    height: 400px;
    overflow: scroll;
}
</style>
