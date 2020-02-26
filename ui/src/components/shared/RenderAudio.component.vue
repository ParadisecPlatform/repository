<template>
    <div>
        <render-audio-element-component
            v-for="(instance, name, idx) of audio"
            :key="idx"
            :item="instance"
            :name="name"
            :transcriptions="transcriptions[name]"
        />
    </div>
</template>

<script>
import { cloneDeep, compact, orderBy, groupBy } from "lodash";

import RenderAudioElementComponent from "components/shared/RenderAudioElement.component.vue";

export default {
    components: {
        RenderAudioElementComponent
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            audio: {},
            transcriptions: {}
        };
    },
    mounted() {
        this.loadAudio();
    },
    methods: {
        loadAudio() {
            const audioFormats = this.$store.state.configuration.audioFormats;
            let audio = this.data.objectifiedCrate.hasPart.filter(file =>
                audioFormats.includes(file.encodingFormat)
            );
            const datafiles = cloneDeep(this.data.datafiles);
            audio = audio.map(a => {
                if (!datafiles[a.name]) return undefined;
                return {
                    ...a,
                    path: datafiles[a.name].pop().path
                };
            });
            audio = compact(audio);
            audio = orderBy(audio, "name");
            if (this.$route.query.transcription) {
                const transcription = this.$route.query.transcription
                    .split(".")
                    .shift();
                audio = audio.filter(
                    a => a.name.split(".").shift() === transcription
                );
            }
            this.audio = groupBy(audio, a => a.name.split(".").shift());

            const transcriptionFileExtensions = this.$store.state.configuration
                .transcriptionFileExtensions;
            let transcriptions = this.data.objectifiedCrate.hasPart.filter(
                file => {
                    return transcriptionFileExtensions.includes(
                        file.name.split(".").pop()
                    );
                }
            );
            transcriptions = transcriptions.map(t => {
                if (!datafiles[t.name]) return undefined;
                return {
                    ...t,
                    path: datafiles[t.name].pop().path
                };
            });
            transcriptions = compact(transcriptions);
            if (this.$route.query.transcription) {
                const transcription = this.$route.query.transcription;
                transcriptions = transcriptions.filter(
                    t => t.name === transcription
                );
            }
            this.transcriptions = groupBy(transcriptions, t =>
                t.name.split(".").shift()
            );
        }
    }
};
</script>

<style lang="scss" scoped></style>
