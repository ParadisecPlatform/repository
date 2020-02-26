<template>
    <div>
        <el-tabs type="border-card" tab-position="top" v-model="activeTab">
            <el-tab-pane
                label="Images"
                name="images"
                v-if="data.dataTypes.images.length"
            >
                <span slot="label"> <i class="fas fa-images"></i> Images </span>
                <render-images-component
                    :data="data"
                    v-if="activeTab === 'images'"
                />
            </el-tab-pane>
            <el-tab-pane
                label="Audio"
                name="audio"
                v-if="data.dataTypes.audio.length"
            >
                <span slot="label">
                    <i class="fas fa-volume-up"></i> Audio
                </span>
                <render-audio-component
                    :data="data"
                    v-if="activeTab === 'audio'"
                />
            </el-tab-pane>
            <el-tab-pane
                label="Video"
                name="video"
                v-if="data.dataTypes.video.length"
            >
                <span slot="label"> <i class="fas fa-video"></i> Video </span>
                <render-video-component
                    :data="data"
                    v-if="activeTab === 'video'"
                />
            </el-tab-pane>
            <el-tab-pane
                label="Documents"
                name="documents"
                v-if="data.dataTypes.documents.length"
            >
                <span slot="label">
                    <i class="fas fa-file-pdf"></i> Documents
                </span>
                <render-documents-component
                    :data="data"
                    v-if="activeTab === 'documents'"
                />
            </el-tab-pane>
            <el-tab-pane
                label="XML Files"
                name="xmlFiles"
                v-if="data.dataTypes.xmlFiles.length"
            >
                <span slot="label">
                    <i class="fas fa-file"></i> XML Files
                </span>
                <render-xml-component
                    :data="data"
                    v-if="activeTab === 'xmlFiles'"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import RenderImagesComponent from "components/shared/RenderImages.component.vue";
import RenderAudioComponent from "components/shared/RenderAudio.component.vue";
import RenderVideoComponent from "components/shared/RenderVideo.component.vue";
import RenderDocumentsComponent from "components/shared/RenderDocuments.component.vue";
import RenderXmlComponent from "components/shared/RenderXML.component.vue";
import { groupBy } from "lodash";

export default {
    components: {
        RenderImagesComponent,
        RenderAudioComponent,
        RenderVideoComponent,
        RenderDocumentsComponent,
        RenderXmlComponent
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            activeTab: undefined
        };
    },
    mounted() {
        this.setActiveTab();
    },
    methods: {
        setActiveTab() {
            if (this.$route.query.transcription) {
                const transcription = this.$route.query.transcription
                    .split(".")
                    .shift();
                if (
                    this.data.dataTypes.audio.filter(
                        a => a.split(".").shift() === transcription
                    )
                ) {
                    this.activeTab = "audio";
                } else if (
                    this.data.dataTypes.audio.filter(
                        a => a.split(".").shift() === transcription
                    )
                ) {
                    this.activeTab = "video";
                }
            } else {
                const types = [];
                for (let type of Object.entries(this.data.dataTypes)) {
                    if (type[1].length) types.push(type[0]);
                }
                this.activeTab = types[0];
            }
        }
    }
};
</script>

<style lang="scss" scoped></style>
