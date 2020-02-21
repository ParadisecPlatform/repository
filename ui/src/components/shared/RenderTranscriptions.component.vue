<template>
    <div class="flex flex-col">
        <div :id="transcription.displayName" class="style-transcription">
            <component
                v-bind:is="transcriptionRendererComponent"
                :transcription="transcription"
                :current-time="currentTime"
                v-on:play-from="playFrom"
            ></component>

            <div v-if="error" class="text-center">
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
import RenderTranscriptionFlextextComponent from "./RenderTranscriptionFlextext.component.vue";

export default {
    components: {
        RenderTranscriptionEafComponent,
        RenderTranscriptionIxtComponent,
        RenderTranscriptionTrsComponent,
        RenderTranscriptionFlextextComponent
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
            error: false,
            transcriptionRendererComponent: undefined,
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
                const transcriptionContent = await dataLoader.loadTranscription(
                    { transcription }
                );
                if (!transcriptionContent) {
                    this.error = true;
                    return;
                }
                this.transcription = {
                    ...transcription,
                    displayName: (transcription.displayName = transcription.name
                        .split(".")
                        .slice(0, -1)
                        .join(".")),
                    ...transcriptionContent
                };

                switch (this.transcription.type) {
                    case "ixt":
                        this.transcriptionRendererComponent =
                            "RenderTranscriptionIxtComponent";
                        break;
                    case "trs":
                        this.transcriptionRendererComponent =
                            "RenderTranscriptionTrsComponent";
                        break;
                    case "eaf":
                        this.transcriptionRendererComponent =
                            "RenderTranscriptionEafComponent";
                        break;
                    case "flextext":
                        this.transcriptionRendererComponent =
                            "RenderTranscriptionFlextextComponent";
                        break;
                }

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
    height: 500px;
    overflow: scroll;
}
</style>
