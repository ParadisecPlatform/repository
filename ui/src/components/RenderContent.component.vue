<template>
    <el-tabs type="border-card" tab-position="top" v-model="activeTab">
        <el-tab-pane label="Images" name="images" v-if="Object.keys(item.images).length">
            <span slot="label">
                <i class="fas fa-images"></i> Images
            </span>
            <render-images-component :items="item.images" v-if="Object.keys(item.images).length" />
        </el-tab-pane>
        <el-tab-pane label="Audio" name="audio" v-if="Object.keys(item.audio).length">
            <span slot="label">
                <i class="fas fa-volume-up"></i> Audio
            </span>
            <render-audio-component
                v-for="(instance, name, idx) of item.audio"
                :key="idx"
                :item="instance"
                :name="name"
                :transcriptions="item.transcriptions[name]"
                :is-active="activeTab === 'audio'"
            />
        </el-tab-pane>
        <el-tab-pane label="Video" name="video" v-if="Object.keys(item.video).length">
            <span slot="label">
                <i class="fas fa-video"></i> Video
            </span>
            <render-video-component
                v-for="(instance, name, idx) of item.video"
                :key="idx"
                :item="instance"
                :name="name"
                :transcriptions="item.transcriptions[name]"
                :is-active="activeTab === 'video'"
            />
        </el-tab-pane>
        <el-tab-pane label="XML Files" name="xmlFiles">
            <span slot="label">
                <i class="fas fa-file"></i> XML Files
            </span>
            <render-xml-component :files="item.hasPart" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import { groupBy, map } from "lodash";
import RenderAudioComponent from "./RenderAudio.component.vue";
import RenderVideoComponent from "./RenderVideo.component.vue";
import RenderImagesComponent from "./RenderImages.component.vue";
import RenderXmlComponent from "./RenderXML.component.vue";

export default {
    components: {
        RenderAudioComponent,
        RenderVideoComponent,
        RenderImagesComponent,
        RenderXmlComponent
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            activeTab: "images",
            items: {
                audio: [],
                video: []
            }
        };
    },
    mounted() {
        let content = {
            images: Object.keys(this.item.images).length > 0,
            audio: Object.keys(this.item.audio).length > 0,
            video: Object.keys(this.item.video).length > 0
        };
        const types = Object.keys(content);
        for (let type of types) {
            if (content[type]) {
                this.activeTab = type;
                return;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>