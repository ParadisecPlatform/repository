<template>
    <div class="flex flex-col bg-indigo-100 rounded p-4">
        <div class="flex flex-col md:flex-row my-2">
            <div class="">{{ selectedName }}</div>
            <div class="flex-grow"></div>
            <el-pagination
                :background="true"
                layout="prev, pager, next"
                :page-size="1"
                :total="total"
                @current-change="update"
            ></el-pagination>
        </div>
        <render-audio-element-component
            v-if="selectedName"
            class=""
            :items="audio[selectedName]"
            :name="selectedName"
            :transcriptions="transcriptions[selectedName]"
        />
    </div>
</template>

<script>
import { getFilesByEncoding, getFilesByName } from "../lib";
import { cloneDeep, compact, orderBy, groupBy } from "lodash";
import RenderAudioElementComponent from "./RenderAudioElement.component.vue";

export default {
    components: {
        RenderAudioElementComponent,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            audio: {},
            transcriptions: {},
            current: 0,
            total: undefined,
            selectedName: undefined,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let audio = getFilesByEncoding({
                rocrate: this.data.rocrate,
                formats: this.$store.state.configuration.audioFormats,
            });

            const datafiles = cloneDeep(this.data.datafiles);
            audio = audio.map((v) => {
                if (!datafiles[v.name]) return undefined;
                return {
                    ...v,
                    path: datafiles[v.name].pop().path,
                };
            });
            audio = compact(audio);
            audio = orderBy(audio, "name");

            if (this.$route.query.transcription) {
                const transcription = this.$route.query.transcription.split(".").shift();
                audio = audio.filter((v) => v.name.split(".").shift() === transcription);
            }
            audio = groupBy(audio, (a) => a.name.split(".").shift());

            let transcriptions = getFilesByName({
                rocrate: this.data.rocrate,
                formats: this.$store.state.configuration.transcriptionFileExtensions,
            });
            transcriptions = transcriptions.map((t) => {
                if (!datafiles[t.name]) return undefined;
                return {
                    ...t,
                    path: datafiles[t.name].pop().path,
                };
            });
            transcriptions = compact(transcriptions);
            if (this.$route.query.transcription) {
                const transcription = this.$route.query.transcription;
                transcriptions = transcriptions.filter((t) => t.name === transcription);
            }
            transcriptions = groupBy(transcriptions, (t) => t.name.split(".").shift());

            // console.log(JSON.stringify(audio, null, 2));
            // console.log(JSON.stringify(transcriptions, null, 2));

            this.audio = audio;
            this.transcriptions = transcriptions;
            this.total = Object.keys(audio).length;
            this.setSelectedFile();
        },
        update(number) {
            this.current = number - 1;
            this.selectedName = undefined;
            this.$nextTick(() => {
                this.setSelectedFile();
            });
        },
        setSelectedFile() {
            this.selectedName = Object.keys(this.audio)[this.current];
        },
    },
};
</script>
