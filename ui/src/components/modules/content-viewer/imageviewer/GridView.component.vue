<template>
    <div class="flex flex-col bg-indigo-100 p-1">
        <div class="flex flex-col md:flex-row md:space-x-2 my-2" v-if="data.showGridView">
            <div class="flex-grow"></div>
            <el-pagination
                v-model:currentPage="data.current"
                :page-size="data.n"
                layout="total, prev, pager, next"
                :total="data.total"
                @current-change="update"
            />
        </div>
        <div class="grid grid-cols-4 gap-4 place-items-center" v-if="data.showGridView">
            <div
                v-for="image of data.images"
                :key="image['@id']"
                class="flex flex-col cursor-pointer border border-gray-400 p-1 w-64"
                @click="loadImage(image)"
            >
                <div>
                    <img :src="image.url" />
                </div>
                <div class="text-center text-sm">{{ image["@id"].split(".")[0] }}</div>
            </div>
        </div>
        <div v-else class="flex flex-col">
            <div class="flex flex-row">
                <div class="cursor-pointer text-4xl" @click="back()">
                    <i class="fa-solid fa-arrow-left"></i> <i class="fa-solid fa-grip"></i>
                </div>
                <div class="flex-grow"></div>
                <div class="p-2">{{ data.selectedImage["@id"] }}</div>
                <copy-to-clipboard-component class="p-2" :data="data.itemLink" />
            </div>
            <div class="flex flex-row">
                <image-viewer-component
                    :class="{ 'w-1/2': data.loadTeiViewer, 'w-full': !data.loadTeiViewer }"
                    :max-height="maxHeight"
                    :image="data.selectedImage"
                    @update-route="updateRoute"
                />
                <tei-viewer-component
                    class="w-1/2"
                    :max-height="maxHeight"
                    :tei="data.tei"
                    v-if="data.loadTeiViewer"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import ImageViewerComponent from "./ImageViewer.component.vue";
import CopyToClipboardComponent from "@/components/modules/CopyToClipboard.component.vue";
import TeiViewerComponent from "./TeiViewer.component.vue";
import { getFilesByEncoding, getPresignedUrlBatch, getImageFiles, loadTei, basename } from "../lib";
import { reactive, onMounted, inject, watch, computed } from "vue";
import { isEmpty } from "lodash";
import { groupBy } from "lodash";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const $http = inject("$http");
const $store = useStore();
const $route = useRoute();
const $router = useRouter();
const $emit = defineEmits(["update-route"]);

const props = defineProps({
    crate: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    showGridView: true,
    loadTeiViewer: false,
    n: 12,
    total: 0,
    current: 1,
    images: [],
    selectedImage: {},
    itemLink: "",
    tei: "",
});
let maxHeight = computed(() => {
    return { height: `${window.innerHeight - 300}px` };
});
watch(
    () => $route.query,
    () => updateView()
);
onMounted(() => {
    if (!$route.path.match(/.*images$/)) {
        $emit("update-route", {
            contentType: "images",
        });
    }
    if ($route.query.page) {
        data.current = parseInt($route.query.page);
    }
    load();
});
async function load() {
    const { images, thumbnails, imagesGroupedById, imageNames, total } = getImageFiles({
        crate: props.crate,
        formats: $store.getters.getConfiguration.ui.imageFormats,
    });
    data.total = total;
    data.imagesGroupedById = imagesGroupedById;

    let displaySet;
    if (thumbnails.length) {
        displaySet = thumbnails.slice(
            (data.current - 1) * data.n,
            (data.current - 1) * data.n + data.n
        );
    } else {
        displaySet = imageNames
            .slice((data.current - 1) * data.n, (data.current - 1) * data.n + data.n)
            .map((name) => imagesGroupedById[name][0]);
    }
    let urls = await getPresignedUrlBatch({
        $http,
        $route,
        images: displaySet.map((image) => image["@id"]),
    });
    displaySet = displaySet.map((image, i) => ({ ...image, url: urls[i] }));
    data.images = [...displaySet];
    if ($route.query.file) {
        let images = data.imagesGroupedByName[basename($route.query.file)];
        let image = images.filter((image) => image["@id"] === $route.query.file);
        loadImage(image[0]);
    }
}
async function update(number) {
    data.current = number;
    $emit("update-route", {
        contentType: "images",
        query: {
            page: number,
        },
    });
    load();
}
async function loadImage(image) {
    data.loadTeiViewer = false;
    let images = data.imagesGroupedById[basename(image["@id"])].filter(
        (image) => !image["@id"].match(/thumbnail/) && !image["@id"].match(/thumb/)
    );

    let { document } = await loadTei({ $http, $route, filename: basename(image["@id"]) });
    if (document) {
        data.tei = document;
        data.loadTeiViewer = true;
    }
    data.selectedImage = images[0];
    data.itemLink = window.location.href;
    data.showGridView = false;
}
function updateRoute(data) {
    $emit("update-route", data);
}
function updateView() {
    if (isEmpty($route.query) || $route.query.page) data.showGridView = true;
}
function back() {
    $router.go(-1);
}
</script>
