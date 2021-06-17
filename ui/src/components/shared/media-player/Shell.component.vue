<template>
    <div>
        <el-tabs type="border-card" tab-position="top" v-model="activeTab">
            <el-tab-pane label="Images" name="image" v-if="enable.image">
                <span slot="label"> <i class="fas fa-images"></i> Images </span>
                <image-viewer-component
                    :data="data"
                    v-if="activeTab === 'image'"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Audio" name="audio" v-if="enable.audio">
                <span slot="label"> <i class="fas fa-volume-up"></i> Audio </span>
                <audio-player-component
                    :data="data"
                    v-if="activeTab === 'audio'"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Video" name="video" v-if="enable.video">
                <span slot="label"> <i class="fas fa-video"></i> Video </span>
                <video-player-component
                    :data="data"
                    v-if="activeTab === 'video'"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="Documents" name="document" v-if="enable.document">
                <span slot="label"> <i class="fas fa-file-pdf"></i> Documents </span>
                <document-viewer-component
                    :data="data"
                    v-if="activeTab === 'document'"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
            <el-tab-pane label="XML Files" name="xml" v-if="enable.xml">
                <span slot="label"> <i class="fas fa-file"></i> XML Files </span>
                <xml-viewer-component
                    :data="data"
                    v-if="activeTab === 'xml'"
                    @update-route="updateRoute"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ImageViewerComponent from "./imageviewer/Shell.component.vue";
import AudioPlayerComponent from "./audioplayer/Shell.component.vue";
import VideoPlayerComponent from "./videoplayer/Shell.component.vue";
import DocumentViewerComponent from "./documentviewer/Shell.component.vue";
import XmlViewerComponent from "./xmlviewer/Shell.component.vue";
import { getFilesByName, getFilesByEncoding, updateRouterLocation } from "./lib";

export default {
    components: {
        ImageViewerComponent,
        AudioPlayerComponent,
        VideoPlayerComponent,
        DocumentViewerComponent,
        XmlViewerComponent,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            activeTab: "images",
            enable: {
                image: false,
                audio: false,
                video: false,
                document: false,
                xml: false,
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.enable.image =
                getFilesByEncoding({
                    rocrate: this.data.rocrate,
                    formats: this.$store.state.configuration.imageFormats,
                }).length > 0;
            this.enable.audio =
                getFilesByEncoding({
                    rocrate: this.data.rocrate,
                    formats: this.$store.state.configuration.audioFormats,
                }).length > 0;
            this.enable.video =
                getFilesByEncoding({
                    rocrate: this.data.rocrate,
                    formats: this.$store.state.configuration.videoFormats,
                }).length > 0;
            this.enable.document =
                getFilesByName({
                    rocrate: this.data.rocrate,
                    formats: this.$store.state.configuration.documentFileExtensions,
                }).length > 0;
            this.enable.xml =
                getFilesByEncoding({
                    rocrate: this.data.rocrate,
                    formats: ["application/xml"],
                }).length > 0;
            this.setActiveTab();
        },
        setActiveTab() {
            for (let key of Object.keys(this.enable)) {
                if (this.enable[key]) {
                    this.activeTab = key;
                    break;
                }
            }
            if (this.$route.hash && this.$route.query?.type) {
                this.activeTab = this.$route.query.type;
            }
        },
        updateRoute(params) {
            this.itemLink = updateRouterLocation({
                router: this.$router,
                route: this.$route,
                hash: params.hash,
                type: params.type,
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
