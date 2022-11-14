<template>
    <div class="flex flex-col lg:flex-row">
        <div class="w-full flex flex-col" :class="{ 'lg:w-1/2': hasTranscriptions }">
            <video
                ref="mediaElement"
                controls
                class="block w-full"
                @timeupdate="notifyTranscription"
            >
                <source :src="file.url" v-for="file of props.videoFiles" :key="file.url" />
                Your browser does not support the <code>video</code> element.
            </video>
            <render-transcription-selector-component
                v-if="hasTranscriptions"
                :transcriptions="props.transcriptions"
                :selected-transcription="props.selectedTranscription"
                v-on:load-transcription="loadTranscription"
            />
        </div>
        <div
            class="w-full border-l border-gray-300"
            :class="{ 'lg:w-1/2': hasTranscriptions }"
            v-if="hasTranscriptions"
        >
            <render-transcriptions-component
                class="font-light"
                :transcriptions="props.transcriptions"
                :selected-transcription="props.selectedTranscription"
                :current-time="data.currentTime"
                v-on:play-from="playFrom"
            />
        </div>
    </div>
</template>

<script setup>
import RenderTranscriptionsComponent from "../transcription-viewers/RenderTranscriptions.component.vue";
import RenderTranscriptionSelectorComponent from "../transcription-viewers/RenderTranscriptionSelector.component.vue";
import { reactive, onMounted, computed, ref } from "vue";
import { useRoute } from "vue-router";
const $route = useRoute();

const $emit = defineEmits(["update-route", "load-transcription"]);
const props = defineProps({
    selectedVideoFile: {
        type: String,
        required: true,
    },
    selectedTranscription: {
        type: String,
        required: true,
    },
    videoFiles: {
        type: Array,
        required: true,
    },
    transcriptions: {
        type: Array,
        required: true,
    },
});
const data = reactive({
    currentTime: 0,
    selectedTranscription: {},
});
const hasTranscriptions = computed(() => props?.transcriptions.length);
const mediaElement = ref(null);
onMounted(() => {
    init();
});

function init() {
    if ($route.query.transcription && $route.query.start && $route.query.end) {
        setTimeout(() => {
            playFrom({
                start: $route.query.start,
                end: $route.query.end,
            });
        }, 1500);
    }
}
function playFrom({ start, end }) {
    if (!start || !end) return;
    updateRoute({ start, end });
    try {
        mediaElement.value.currentTime = start;
        mediaElement.value.play();
        setTimeout(() => {
            mediaElement?.value?.pause();
        }, (end - start) * 1000);
    } catch (error) {
        console.error(error);
    }
}
function notifyTranscription() {
    if (mediaElement.value?.currentTime) data.currentTime = mediaElement.value.currentTime;
}
async function loadTranscription({ transcription }) {
    // updateRoute({ transcription: transcription["@id"] });
    $emit("load-transcription", { transcription });
}

function updateRoute({ start, end }) {
    if (start && end) {
        let query = {
            transcription: props.selectedTranscription,
            start,
            end,
        };
        $emit("update-route", { query });
    }
}
</script>
