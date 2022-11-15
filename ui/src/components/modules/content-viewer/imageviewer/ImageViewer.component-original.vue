<template>
    <div class="flex flex-col bg-indigo-100 p-1">
        <div class="flex flex-col md:flex-row md:space-x-2">
            <div class="p-2">{{ data.currentImage.name }}</div>
            <copy-to-clipboard-component class="p-2" :data="data.itemLink" />
            <div class="flex-grow"></div>
            <el-pagination
                v-model:currentPage="data.current"
                :page-size="1"
                layout="total, prev, pager, next"
                :total="data.imageNames.length"
                @current-change="update"
            />
        </div>
        <div class="mt-4 p-2">
            <div class="flex flex-col justify-around relative">
                <div
                    v-if="data.currentImage.url"
                    class="absolute cursor-pointer"
                    style="
                        top: 98px;
                        width: 50px;
                        height: 50px;
                        right: 0px;
                        z-index: 10;
                        background-color: rgba(255, 255, 255, 0.9);
                    "
                    @click="refresh"
                >
                    <span
                        class="text-gray-500"
                        style="
                            position: absolute;
                            top: 55%;
                            left: 43%;
                            transform: translate(-50%, -50%);
                            width: 12px;
                        "
                    >
                        <i class="fa-solid fa-sync"></i>
                    </span>
                </div>
                <div :style="maxHeight">
                    <div id="image" :data-zoomist-src="data.currentImage.url" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getFilesByEncoding, getPresignedUrl } from "../lib";
import { groupBy, uniq } from "lodash";
import CopyToClipboardComponent from "@/components/modules/CopyToClipboard.component.vue";
import { reactive, onMounted, nextTick, inject, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Zoomist from "zoomist";
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
    imageNames: [],
    imagesGroupedByName: {},
    currentImage: [],
    current: 1,
    itemLink: "",
});
onMounted(() => {
    init();
});
let maxHeight = computed(() => {
    return { height: `${window.innerHeight - 280}px` };
});

async function init() {
    let images = getFilesByEncoding({
        crate: props.crate,
        formats: $store.getters.getConfiguration.ui.imageFormats,
    });

    data.imagesGroupedByName = groupBy(
        images,
        (image) => image["@id"].split("/").pop().split(".")[0]
    );
    data.imageNames = uniq(
        images.map((image) => image["@id"].split("/").pop().split(".")[0])
    ).sort();
    update(1);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
}

async function loadImage() {
    const selectedImageName = data.imageNames[data.current - 1];
    let images = data.imagesGroupedByName[selectedImageName].filter(
        (image) => !image["@id"].match(/thumbnail/)
    );
    for (let image of images) {
        let url = await getPresignedUrl({
            $http,
            $route,
            filename: image["@id"],
        });
        image.url = url;
    }
    data.currentImage = images.filter((image) => image.encodingFormat === "image/jpeg")[0];

    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!data.zoomist) {
        data.zoomist = new Zoomist("#image", {
            fill: "contain",
            maxRatio: 10,
            slider: true,
            zoomer: true,
            height: window.innerHeight - 280,
        });
    } else {
        data.zoomist.update();
    }
}

async function update(number) {
    data.current = number;
    await loadImage();
    $emit("update-route", {
        contentType: "images",
        query: {
            file: data.currentImage["@id"],
        },
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    data.itemLink = window.location.href;
}

function refresh() {
    data.zoomist.update();
}
</script>
