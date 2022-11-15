<template>
    <div>
        <el-tabs tab-position="top" v-model="data.activeTab">
            <el-tab-pane label="Images" name="images" v-if="data.enable.images.length">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-images"></i> Images</div>
                </template>
                <image-viewer-component
                    class="my-1"
                    v-if="data.activeTab === 'images'"
                    :crate="this.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Audio" name="audio" v-if="data.enable.audio.length">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-volume-up"></i> Audio</div>
                </template>
                <audio-player-component
                    class="my-1"
                    v-if="data.activeTab === 'audio'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Video" name="video" v-if="data.enable.video.length">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-video"></i> Videos</div>
                </template>
                <video-player-component
                    class="my-1"
                    v-if="data.activeTab === 'video'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Documents" name="documents" v-if="data.enable.documents.length">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-file"></i> Documents</div>
                </template>
                <document-viewer-component
                    class="my-1"
                    v-if="data.activeTab === 'documents'"
                    :crate="props.crate"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="XML Files" name="xml" v-if="data.enable.xml.length">
                <template #label>
                    <div class="text-lg py-2"><i class="fas fa-code"></i> XML Files</div>
                </template>
                <xml-viewer-component
                    class="my-1"
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
    activeTab: "images",
    enable: {
        images: false,
        audio: false,
        video: false,
        documents: false,
        xml: false,
    },
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
