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
        <iframe
            :src="data.selectedFileUrl"
            class="overflow-scroll"
            :style="{ height: panelHeight }"
        >
            <p>Your browser does not support iframes.</p>
        </iframe>
        <!-- <iframe
            :src="data.selectedFileUrl"
            frameborder="0"
            class="overflow-scroll"
            :style="{ height: panelHeight }"
        >
            This is an embedded
            <a target="_blank" href="http://office.com">Microsoft Office</a> document, powered by
            <a target="_blank" href="http://office.com/webapps">Office Online</a>.
        </iframe> -->
        <!-- <iframe
    src="https://docs.google.com/viewer?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true"
    style="width:600px; height:500px;"
    frameborder="0"
        ></iframe>-->
    </div>
</template>

<script setup>
import { getFilesByName, getPresignedUrl, panelHeight } from "../lib";
import { reactive, onMounted, computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import CopyToClipboardComponent from "@/components/modules/CopyToClipboard.component.vue";
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
// Document preview in browser: https://stackoverflow.com/a/27958186
const data = reactive({
    documents: [],
    total: 0,
    current: 1,
    selectedFileUrl: undefined,
    documentName: undefined,
    itemLink: "",
    viewer: {
        google: "https://docs.google.com/viewer?url",
        microsoft: "https://view.officeapps.live.com/op/embed.aspx?src",
    },
});
onMounted(() => {
    init();
});
async function init() {
    let documents = getFilesByName({
        crate: props.crate,
        formats: $store.getters.getConfiguration.ui.documentFileExtensions,
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
    setSelectedFile();
    updateRoute();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
}
async function setSelectedFile() {
    data.documentName = data.documents[data.current - 1]["@id"];
    let url = await getPresignedUrl({ $http, $route, filename: data.documentName });
    url = encodeURIComponent(url);
    let extension = data.documentName.split(".")[1];
    // if (["pdf", "rtf", "txt"].includes(extension)) {
    data.selectedFileUrl = `${data.viewer.google}=${url}&embedded=true`;
    // } else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
    //     data.selectedFileUrl = `${data.viewer.microsoft}=${url}`;
    // }
    // this.$nextTick(() => {
    //     this.itemLink = window.location;
    // });
    data.itemLink = window.location.href;
}
async function handleCurrentChange(number) {
    data.current = number;
    updateRoute({});
    await setSelectedFile();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
}
function updateRoute() {
    const file = data.documents[data.current - 1]["@id"];
    const route = {
        contentType: "documents",
    };
    $emit("update-route", { ...route, query: { file } });
}
</script>
