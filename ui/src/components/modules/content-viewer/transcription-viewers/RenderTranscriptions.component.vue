<template>
    <div class="flex flex-col">
        <div v-if="data.error" class="text-center p-4">There was an error loading that file.</div>
        <div
            class="overflow-scroll"
            :style="{ height: panelHeight }"
            :id="data.transcription.selectedTranscription"
            v-if="!data.error"
        >
            <component
                :is="transcriptionRendererComponent"
                :transcription="data.transcription"
                :current-time="props.currentTime"
                v-on:play-from="playFrom"
            ></component>
        </div>
    </div>
</template>

<script setup>
import RenderTranscriptionEafComponent from "./RenderTranscriptionEAF.component.vue";
import RenderTranscriptionIxtComponent from "./RenderTranscriptionIXT.component.vue";
import RenderTranscriptionTrsComponent from "./RenderTranscriptionTRS.component.vue";
import RenderTranscriptionFlextextComponent from "./RenderTranscriptionFlextext.component.vue";
import { reactive, shallowRef, onMounted, onBeforeUnmount, watch, inject } from "vue";
import { useRoute } from "vue-router";
import { isEmpty } from "lodash";
import { scrollTo } from "vue-scrollto";
import { loadTranscription, panelHeight } from "../lib.js";
const $http = inject("$http");
const $route = useRoute();

const $emit = defineEmits(["play-from"]);
const props = defineProps({
    transcriptions: {
        type: Array,
        required: true,
    },
    selectedTranscription: {
        type: String,
        required: true,
    },
    currentTime: {
        type: Number,
    },
});
const data = reactive({
    watchers: {},
    error: false,
    transcriptionRendererComponent: undefined,
    transcription: {
        type: undefined,
        segments: [],
    },
});
let transcriptionRendererComponent = shallowRef();

data.watchers.selectedTranscription = watch(
    () => props.selectedTranscription,
    () => {
        load();
        scrollToTop();
    }
);

onMounted(() => {
    load();
});
onBeforeUnmount(() => {
    data.watchers.selectedTranscription();
});
async function load() {
    if (!props.selectedTranscription) return;
    try {
        let { transcription } = await loadTranscription({
            $http,
            $route,
            filename: props.selectedTranscription,
        });
        if (isEmpty(transcription)) {
            data.error = true;
            return;
        }
        data.transcription = {
            selectedTranscription: props.selectedTranscription.split(".")[0],
            ...transcription,
        };
        switch (data.transcription.type) {
            case "ixt":
                transcriptionRendererComponent.value = RenderTranscriptionIxtComponent;
                break;
            case "trs":
                transcriptionRendererComponent.value = RenderTranscriptionTrsComponent;
                break;
            case "eaf":
                transcriptionRendererComponent.value = RenderTranscriptionEafComponent;
                break;
            case "flextext":
                transcriptionRendererComponent.value = RenderTranscriptionFlextextComponent;
                break;
        }
        data.error = false;
    } catch (error) {
        data.error = true;
        transcriptionRendererComponent.value = "";
    }
}
function scrollToTop() {
    if (!data.error && data.transcription.selectedTranscription) {
        setTimeout(() => {
            scrollTo(`#${data.transcription.selectedTranscription}`, 300, {
                container: `#${data.transcription.selectedTranscription}`,
            });
        }, 1500);
    }
}
function playFrom({ start, end }) {
    $emit("play-from", { start, end });
}
</script>
