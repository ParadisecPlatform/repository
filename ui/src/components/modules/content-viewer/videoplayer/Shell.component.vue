<template>
    <div class="flex flex-col bg-indigo-100 p-1">
        <div class="flex flex-col md:flex-row md:space-x-2">
            <div class="p-2">{{ data.selectedVideoFile }}</div>
            <copy-to-clipboard-component class="p-2" :data="data.itemLink" />
            <div class="flex-grow"></div>
            <el-pagination
                v-model:currentPage="data.current"
                :page-size="1"
                layout="total, prev, pager, next"
                :total="data.total"
                @current-change="handleCurrentChange"
            />
        </div>
        <render-video-element-component
            class="p-2"
            v-if="data.ready"
            :selected-video-file="data.selectedVideoFile"
            :selected-transcription="data.selectedTranscription"
            :videoFiles="data.videoFiles[data.selectedVideoFile]"
            :transcriptions="data.transcriptionFiles[data.selectedVideoFile]"
            @update-route="updateRoute"
            @load-transcription="loadTranscription"
        />
    </div>
</template>

<script setup>
import { getFilesByEncoding, getPresignedUrl, getFilesByName } from "../lib";
import { orderBy, groupBy } from "lodash";
import RenderVideoElementComponent from "./RenderVideoElement.component.vue";
import CopyToClipboardComponent from "@/components/modules/CopyToClipboard.component.vue";
import { reactive, onMounted, inject } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const $http = inject("$http");
const $store = useStore();
const $route = useRoute();
const $emit = defineEmits(["update-route"]);

const props = defineProps({
    crate: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    videoFiles: {},
    transcriptionFiles: {},
    current: 1,
    total: 0,
    selectedVideoFile: undefined,
    selectedTranscription: undefined,
    ready: false,
    itemLink: "",
});
onMounted(() => {
    init();
});
async function init() {
    data.ready = false;
    let videoFiles = getFilesByEncoding({
        crate: props.crate,
        formats: $store.getters.getConfiguration.ui.videoFormats,
    });

    videoFiles = orderBy(videoFiles, "name");
    data.videoFiles = groupBy(videoFiles, (a) => a["@id"].split(".").shift());

    let transcriptions = getFilesByName({
        crate: props.crate,
        formats: $store.getters.getConfiguration.ui.transcriptionFileExtensions,
    });
    data.transcriptionFiles = groupBy(transcriptions, (t) => t["@id"].split(".").shift());

    // console.log(JSON.stringify(transcriptions, null, 2));
    // console.log(JSON.stringify(videoFiles, null, 2));

    // set current to whatever is in the route path if defined
    Object.keys(data.videoFiles).forEach((file, idx) => {
        if ($route.path.match(file)) {
            data.current = idx + 1;
        } else {
            data.current = 1;
        }
    });

    data.selectedVideoFile = Object.keys(data.videoFiles)[data.current - 1];
    data.total = Object.keys(data.videoFiles).length;
    await load();

    if ($route.query.transcription && $route.params.contentType === "video") {
        data.selectedTranscription = $route.query.transcription;
    } else {
        updateRoute({
            query: {
                transcription: data.transcriptionFiles[data.selectedVideoFile][0]["@id"],
                start: 0,
            },
        });
        data.selectedTranscription = data.transcriptionFiles[data.selectedVideoFile][0]["@id"];
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
    data.ready = true;
}
async function load() {
    const file = data.videoFiles[data.selectedVideoFile][0];
    if (!file.url) {
        let url = await getPresignedUrl({
            $http,
            $route,
            filename: file["@id"],
        });
        file.url = url;
    }
}
async function loadTranscription({ transcription }) {
    data.selectedTranscription = transcription;
    updateRoute({
        query: {
            transcription,
            start: 0,
        },
    });
}
async function handleCurrentChange(number) {
    data.current = number;
    updateRoute({});
    await setSelectedFile();
}
async function setSelectedFile() {
    data.ready = false;
    data.selectedVideoFile = Object.keys(data.videoFiles)[data.current - 1];
    data.selectedTranscription = data.transcriptionFiles[data.selectedVideoFile][0]["@id"];
    updateRoute({
        query: {
            transcription: data.selectedTranscription,
            start: 0,
        },
    });
    await load();
    data.ready = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
}
function updateRoute({ query }) {
    const route = {
        contentType: "video",
        contentId: data.selectedVideoFile,
    };
    if (query) {
        $emit("update-route", { ...route, query });
    } else {
        $emit("update-route", { ...route });
    }
}
</script>
