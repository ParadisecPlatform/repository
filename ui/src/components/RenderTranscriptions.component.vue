<template>
    <div class="flex flex-col">
        <el-radio-group
            v-model="selectedTranscription"
            @change="loadTranscription"
            class="flex flex-row flex-wrap m-4"
        >
            <el-radio
                v-for="(transcription, idx) of transcriptions"
                :key="idx"
                :label="transcription"
            >{{transcription.name}}</el-radio>
        </el-radio-group>
        <div :id="transcription.displayName" class="style-transcription m-4">
            <render-transcription-eaf-component
                v-if="transcription.type === 'eaf'"
                :transcription="transcription"
                :current-time="currentTime"
                v-on:playFrom="playFrom"
            />

            <render-transcription-eaf-component
                v-if="transcription.type === 'trs'"
                :transcription="transcription"
                :current-time="currentTime"
                v-on:playFrom="playFrom"
            />

            <render-transcription-ixt-component
                v-if="transcription.type === 'ixt'"
                :transcription="transcription"
                :current-time="currentTime"
                v-on:playFrom="playFrom"
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
        currentTime: {
            type: Number
        }
    },
    data() {
        return {
            selectedTranscription: this.transcriptions[0],
            transcription: {
                type: undefined,
                segments: []
            }
        };
    },
    mounted() {
        this.loadTranscription(this.transcriptions[0]);
    },
    methods: {
        async loadTranscription(transcription) {
            transcription = this.transcriptions.filter(
                t => t.id === transcription.id
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
            this.$emit("playFrom", { start, end });
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