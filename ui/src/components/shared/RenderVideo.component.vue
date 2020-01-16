<template>
    <el-card shadow="never" class="my-2">
        <render-video-element-component
            v-for="(instance, name, idx) of video"
            :key="idx"
            :item="instance"
            :name="name"
            :transcriptions="transcriptions[name]"
        />
    </el-card>
</template>

<script>
import { cloneDeep, compact, orderBy, groupBy } from "lodash";

import RenderVideoElementComponent from "components/shared/RenderVideoElement.component.vue";

export default {
    components: {
        RenderVideoElementComponent
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            video: {},
            transcriptions: {}
        };
    },
    mounted() {
        this.loadVideo();
    },
    methods: {
        loadVideo() {
            const videoFormats = this.$store.state.configuration.videoFormats;
            let video = this.data.objectifiedCrate.hasPart.filter(file =>
                videoFormats.includes(file.encodingFormat)
            );
            const datafiles = cloneDeep(this.data.datafiles);
            video = video.map(v => {
                if (!datafiles[v.name]) return undefined;
                return {
                    ...v,
                    path: datafiles[v.name].pop().path
                };
            });
            video = compact(video);
            video = orderBy(video, "name");
            this.video = groupBy(video, v => v.name.split(".").shift());

            const transcriptionFileExtensions = this.$store.state.configuration
                .transcriptionFileExtensions;
            let transcriptions = this.data.objectifiedCrate.hasPart.filter(
                file => {
                    return transcriptionFileExtensions.includes(
                        file.name.split(".").pop()
                    );
                }
            );
            transcriptions = transcriptions.map(t => {
                if (!datafiles[t.name]) return undefined;
                return {
                    ...t,
                    path: datafiles[t.name].pop().path
                };
            });
            transcriptions = compact(transcriptions);
            this.transcriptions = groupBy(transcriptions, t =>
                t.name.split(".").shift()
            );
        }
    }
};
</script>

<style lang="scss" scoped>
.style-video-element {
    width: 100%;
}
</style>
