<template>
    <div>
        <el-tabs tab-position="top" v-model="data.activeTab">
            <el-tab-pane
                label="Images"
                name="images"
                v-if="data.enable.images.length && data.configuration.enable.images"
            >
                <template #label>
                    <div
                        class="text-lg text-gray-600 hover:text-orange-600 my-2"
                        :class="{ 'text-blue-600': data.activeTab === 'images' }"
                    >
                        <i class="fas fa-images"></i> Images
                    </div>
                </template>
                <image-viewer-component
                    v-if="data.activeTab === 'images'"
                    :crate="this.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane
                label="Audio"
                name="audio"
                v-if="data.enable.audio.length && data.configuration.enable.audio"
            >
                <template #label>
                    <div
                        class="text-lg text-gray-600 hover:text-orange-600 my-2"
                        :class="{ 'text-blue-600': data.activeTab === 'audio' }"
                    >
                        <i class="fas fa-volume-up"></i> Audio
                    </div>
                </template>
                <audio-player-component
                    v-if="data.activeTab === 'audio'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane
                label="Video"
                name="video"
                v-if="data.enable.video.length && data.configuration.enable.video"
            >
                <template #label>
                    <div
                        class="text-lg text-gray-600 hover:text-orange-600 my-2"
                        :class="{ 'text-blue-600': data.activeTab === 'video' }"
                    >
                        <i class="fas fa-video"></i> Videos
                    </div>
                </template>
                <video-player-component
                    v-if="data.activeTab === 'video'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane
                label="Documents"
                name="documents"
                v-if="data.enable.documents.length && data.configuration.enable.documents"
            >
                <template #label>
                    <div
                        class="text-lg text-gray-600 hover:text-orange-600 my-2"
                        :class="{ 'text-blue-600': data.activeTab === 'documents' }"
                    >
                        <i class="fas fa-file"></i> Documents
                    </div>
                </template>
                <document-viewer-component
                    v-if="data.activeTab === 'documents'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane
                label="XML Files"
                name="xml"
                v-if="data.enable.xml.length && data.configuration.enable.xml"
            >
                <template #label>
                    <div
                        class="text-lg text-gray-600 hover:text-orange-600 my-2"
                        :class="{ 'text-blue-600': data.activeTab === 'xml' }"
                    >
                        <i class="fas fa-code"></i> XML Files
                    </div>
                </template>
                <xml-viewer-component
                    v-if="data.activeTab === 'xml'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import ImageViewerComponent from "./imageviewer/GridView.component.vue";
import AudioPlayerComponent from "./audioplayer/Shell.component.vue";
import VideoPlayerComponent from "./videoplayer/Shell.component.vue";
import DocumentViewerComponent from "./documentviewer/Shell.component.vue";
import XmlViewerComponent from "./xmlviewer/Shell.component.vue";
import { categoriseItemContent } from "./lib";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const $store = useStore();
const $router = useRouter();
const $route = useRoute();

const props = defineProps({
    crate: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    activeTab: "",
    enable: {
        images: false,
        audio: false,
        video: false,
        documents: false,
        xml: false,
    },
    configuration: $store.getters.getConfiguration.ui.mediaplayer,
});
onMounted(() => {
    init();
});
const configuration = $store.getters.getConfiguration.ui;
function init() {
    data.enable = categoriseItemContent({
        crate: props.crate,
        formats: {
            images: $store.getters.getConfiguration.ui.imageFormats,
            audio: $store.getters.getConfiguration.ui.audioFormats,
            video: $store.getters.getConfiguration.ui.videoFormats,
            documents: $store.getters.getConfiguration.ui.documentFileExtensions,
            xml: ["application/xml"],
        },
    });
    setActiveTab();
}
function setActiveTab() {
    data.activeTab = $route.params.contentType;
    if (!data.activeTab) {
        for (let key of Object.keys(data.enable)) {
            if (data.enable[key]) {
                data.activeTab = key;
                break;
            }
        }
    }
}
function updateRoute(params) {
    const { collectionId, itemId } = $route.params;
    let basePath;
    if (collectionId && !itemId) {
        basePath = `/collections/${collectionId}`;
    } else if (collectionId && itemId) {
        basePath = `/collections/${collectionId}/items/${itemId}`;
    } else if (itemId && !collectionId) {
        basePath = `/items/${itemId}`;
    }

    let { contentType, contentId, query } = params;
    let path;
    if (contentId) {
        path = `${basePath}/${contentType}/${contentId}`;
    } else {
        path = `${basePath}/${contentType}`;
    }
    $router.push({ path, query });
}
</script>
