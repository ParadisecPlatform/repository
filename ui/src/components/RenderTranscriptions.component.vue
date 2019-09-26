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
            >There was an error loading that file. This is typically due to the XML not being well-formed.</div>
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
            type: Array,
            required: true
        },
        selectedTranscription: {
            type: Object,
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
            let transcription = this.transcriptions.filter(
                t => t.id === this.selectedTranscription.id
            )[0];
            try {
                this.transcription = {
                    ...transcription,
                    ...(await dataLoader.loadTranscription({
                        transcription
                    }))
                };
                setTimeout(() => {
                    this.$scrollTo(`#${transcription.displayName}`, 300, {
                        container: `#${transcription.displayName}`
                    });
                }, 200);
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