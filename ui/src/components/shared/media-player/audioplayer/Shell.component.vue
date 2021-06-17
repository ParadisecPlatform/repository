<template>
    <div class="flex flex-col bg-indigo-100 rounded p-4">
        <div class="flex flex-col md:flex-row md:space-x-2 my-2">
            <div class="">{{ selectedName }}</div>
            <copy-to-clipboard-component :data="itemLink" />
            <div class="flex-grow"></div>
            <el-pagination
                :background="true"
                layout="prev, pager, next"
                :current-page.sync="current"
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
import CopyToClipboardComponent from "src/components/shared/CopyToClipboard.component.vue";

export default {
    components: {
        RenderAudioElementComponent,
        CopyToClipboardComponent,
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
            current: 1,
            total: undefined,
            selectedName: undefined,
            itemLink: undefined,
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
            if (this.$route.hash && this.$route.query?.type === "audio") {
                this.current =
                    Object.keys(this.audio).indexOf(this.$route.hash.replace("#", "")) + 1;
            }
            this.setSelectedFile();
        },
        update(number) {
            this.current = number;
            this.selectedName = undefined;
            this.$nextTick(() => {
                this.setSelectedFile();
            });
        },
        setSelectedFile() {
            this.selectedName = Object.keys(this.audio)[this.current - 1];
            this.$emit("update-route", { hash: this.selectedName, type: "audio" });
            this.$nextTick(() => {
                this.itemLink = window.location;
            });
        },
    },
};
</script>
