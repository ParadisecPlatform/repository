<template>
    <div>
        <el-tabs type="border-card" tab-position="top" v-model="activeTab">
            <el-tab-pane label="Images" name="images" v-if="enable.images">
                <span slot="label"> <i class="fas fa-images"></i> Images </span>
                <image-viewer-component :data="data" v-if="activeTab === 'images'" />
            </el-tab-pane>
            <el-tab-pane label="Audio" name="audio" v-if="enable.audio">
                <span slot="label"> <i class="fas fa-volume-up"></i> Audio </span>
                <audio-player-component :data="data" v-if="activeTab === 'audio'" />
            </el-tab-pane>
            <el-tab-pane label="Video" name="video" v-if="enable.video">
                <span slot="label"> <i class="fas fa-video"></i> Video </span>
                <video-player-component :data="data" v-if="activeTab === 'video'" />
            </el-tab-pane>
            <el-tab-pane label="Documents" name="documents" v-if="enable.documents">
                <span slot="label"> <i class="fas fa-file-pdf"></i> Documents </span>
                <document-viewer-component :data="data" v-if="activeTab === 'documents'" />
            </el-tab-pane>
            <el-tab-pane label="XML Files" name="xmlFiles" v-if="enable.xml">
                <span slot="label"> <i class="fas fa-file"></i> XML Files </span>
                <xml-viewer-component :data="data" v-if="activeTab === 'xmlFiles'" />
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
import { getFilesByName, getFilesByEncoding } from "./lib";

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
                images: false,
                audio: false,
                video: false,
                documents: false,
                xmlFiles: false,
            },
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.enable.images =
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
            this.enable.documents =
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
        },

        // const crate = new ROCrate(this.data.rocrate);
        // crate.index();
        // const parts = crate._item_by_type["File"];
        // console.log(JSON.stringify(parts, null, 2));

        // if (this.$route.query.transcription) {
        //     const transcription = this.$route.query.transcription.split(".").shift();
        //     if (
        //         this.data.dataTypes.audio.filter((a) => a.split(".").shift() === transcription)
        //     ) {
        //         this.activeTab = "audio";
        //     } else if (
        //         this.data.dataTypes.audio.filter((a) => a.split(".").shift() === transcription)
        //     ) {
        //         this.activeTab = "video";
        //     }
        // } else {
        //     const types = [];
        // for (let type of Object.entries(this.data.dataTypes)) {
        //     if (type[1].length) types.push(type[0]);
        // }
        // this.activeTab = types[0];
        // }
    },
};
</script>

<style lang="scss" scoped></style>
