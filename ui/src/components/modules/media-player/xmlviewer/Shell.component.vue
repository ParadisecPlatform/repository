<template>
    <div class="flex flex-col bg-indigo-100 p-1">
        <div class="flex flex-col md:flex-row md:space-x-2">
            <div class="p-2">{{ data.documentName }}</div>
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
        <div v-if="data.error" class="text-center p-4">There was an error loading that file.</div>
        <pre
            class="bg-black overflow-scroll"
            :style="{ height: panelHeight }"
            v-if="!data.error"
            v-loading="data.loading"
        >
            <code v-html="data.fileContent"></code>
        </pre>
    </div>
</template>

<script setup>
import { getFilesByEncoding, getFile, panelHeight } from "../lib";
import { reactive, onMounted, computed, inject } from "vue";
import { useRoute } from "vue-router";
import CopyToClipboardComponent from "@/components/modules/CopyToClipboard.component.vue";
const $http = inject("$http");
const $route = useRoute();
const $emit = defineEmits(["update-route"]);

import format from "xml-formatter";
import Prism from "prismjs";
Prism.highlightAll();

const props = defineProps({
    crate: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    error: false,
    documents: [],
    total: 0,
    current: 1,
    fileContent: "",
    loading: false,
    documentName: undefined,
    itemLink: "",
});
onMounted(() => {
    init();
});
async function init() {
    let documents = getFilesByEncoding({
        crate: props.crate,
        formats: ["application/xml"],
    });
    data.documents = documents;
    data.total = documents.length;

    if ($route.query.file) {
        const ids = data.documents.map((d) => d["@id"]);
        const index = ids.indexOf($route.query.file);
        if (index !== -1) {
            data.current = ids.indexOf($route.query.file) + 1;
        }
    }
    highlight();
    updateRoute();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
}
async function highlight() {
    data.loading = true;
    data.documentName = data.documents[data.current - 1]["@id"];
    try {
        let { content } = await getFile({ $http, $route, filename: data.documentName });
        data.fileContent = Prism.highlight(format(content.trim()), Prism.languages.xml, "xml");
        data.error = false;
    } catch (error) {
        data.error = true;
    }
    data.loading = false;
}
async function handleCurrentChange(number) {
    data.current = number;
    updateRoute();
    highlight();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
}
function updateRoute() {
    const file = data.documents[data.current - 1]["@id"];
    const route = {
        contentType: "xml",
    };
    $emit("update-route", { ...route, query: { file } });
}
</script>
