<template>
    <div class="flex flex-col bg-indigo-100">
        <div class="flex flex-col justify-around relative">
            <div
                v-if="data.image.url"
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
            <div :style="props.maxHeight">
                <div id="image" :data-zoomist-src="data.image.url" class="p-4" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { getPresignedUrl } from "../lib";
import { reactive, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import Zoomist from "zoomist";
const $http = inject("$http");
const $route = useRoute();
const $emit = defineEmits(["update-route"]);

const props = defineProps({
    image: {
        type: Object,
        required: true,
    },
    maxHeight: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    image: {},
});
onMounted(() => {
    $emit("update-route", {
        contentType: "images",
        query: {
            file: props.image["@id"],
        },
    });
    loadImage();
});
async function loadImage() {
    let url = await getPresignedUrl({
        $http,
        $route,
        filename: props.image["@id"],
    });
    data.image = { ...props.image, url };
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

function refresh() {
    data.zoomist.update();
}
</script>
