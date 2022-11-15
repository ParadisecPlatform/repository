<template>
    <div class="overflow-scroll" :style="props.maxHeight">
        <div ref="previewPanel" class="text-gray-200 font-light bg-gray-800"></div>
    </div>
</template>

<script setup>
import "@/assets/tei.css";
import { ref, onMounted } from "vue";

const previewPanel = ref(null);

const props = defineProps({
    tei: {
        type: String,
        required: true,
    },
    maxHeight: {
        type: Object,
        required: true,
    },
});

onMounted(() => {
    renderDocumentPreview();
});

async function renderDocumentPreview() {
    previewPanel.value.insertAdjacentHTML("beforeend", props.tei);
}
</script>
