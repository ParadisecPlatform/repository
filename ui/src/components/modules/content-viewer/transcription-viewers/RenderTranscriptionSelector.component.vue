<template>
    <el-radio-group
        class="flex flex-row"
        v-model="data.selectedTranscription"
        @change="loadTranscription"
    >
        <el-radio
            v-for="transcription of props.transcriptions"
            :key="transcription['@id']"
            :label="transcription['@id']"
        >
            {{ transcription["@id"] }}
        </el-radio>
    </el-radio-group>
</template>

<script setup>
import { reactive, watch } from "vue";
import { useRoute } from "vue-router";
const $route = useRoute();

const $emit = defineEmits(["load-transcription", "update-route"]);
const props = defineProps({
    transcriptions: {
        type: Array,
        required: true,
    },
    selectedTranscription: {
        type: String,
        required: true,
    },
});
const data = reactive({
    selectedTranscription: props.selectedTranscription,
});

watch(
    () => props.selectedTranscription,
    () => {
        data.selectedTranscription = props.selectedTranscription;
    }
);

function loadTranscription(transcription) {
    $emit("load-transcription", { transcription });
}
</script>
