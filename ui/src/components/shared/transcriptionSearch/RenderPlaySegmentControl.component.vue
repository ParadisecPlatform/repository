<template>
    <div class="flex flex-row">
        <el-button
            @click="play"
            type="success"
            size="small"
            :class="{
                'transition duration-500 ease-in-out blinking bg-orange-500 border-orange-500': disablePlay,
            }"
        >
            <i class="fas fa-play"></i>
        </el-button>
        <div v-if="sources.length && mediaType === 'audio'">
            <audio ref="mediaElement" @canplay.once="playSegment">
                <source
                    :src="source"
                    v-for="(source, idx) of sources"
                    :key="idx"
                />
                Your browser does not support the <code>audio</code> element.
            </audio>
        </div>
        <div v-if="sources.length && mediaType === 'video'" class="w-64">
            <video ref="mediaElement" @canplay.once="playSegment">
                <source
                    :src="source"
                    v-for="(source, idx) of sources"
                    :key="idx"
                />
                Your browser does not support the <code>video</code> element.
            </video>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import { compact } from "lodash";

export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            sources: [],
            disablePlay: false,
            mediaType: undefined,
        };
    },
    methods: {
        async play() {
            if (this.disablePlay) return;
            const params = {
                identifier: this.item.segment.identifier,
                configuration: this.$store.state.configuration,
            };
            try {
                const ocflObject = await dataLoader.load({ ...params });

                let mediaElements;
                const audioElements = ocflObject.dataTypes.audio.filter(
                    (m) =>
                        m.split(".").shift() ===
                        this.item.segment.file.split(".").shift()
                );
                if (audioElements.length) {
                    this.mediaType = "audio";
                    mediaElements = audioElements;
                }

                const videoElements = ocflObject.dataTypes.video.filter(
                    (m) =>
                        m.split(".").shift() ===
                        this.item.segment.file.split(".").shift()
                );
                if (videoElements.length) {
                    this.mediaType = "video";
                    mediaElements = videoElements;
                }

                let datafiles = mediaElements.map((e) => {
                    try {
                        return ocflObject.datafiles[e][0].path;
                    } catch (error) {}
                });
                datafiles = compact(datafiles);
                if (datafiles.length) {
                    this.sources = datafiles;
                    this.disablePlay = true;
                }
            } catch (error) {
                console.log(error);
            }
        },
        playSegment() {
            this.$refs.mediaElement.currentTime = this.item.segment.timeBegin;
            this.$refs.mediaElement.play();
            setTimeout(async () => {
                this.$refs.mediaElement.pause();
                this.sources = [];
                await new Promise((resolve) => setTimeout(resolve, 200));
                this.disablePlay = false;
            }, (this.item.segment.timeEnd - this.item.segment.timeBegin) * 1000);
        },
    },
};
</script>

<style lang="scss" scoped>
.blinking {
    animation: blinkingBackground 1s infinite;
}
@keyframes blinkingBackground {
    0% {
        @apply bg-orange-800 border-orange-800;
    }
}
</style>
