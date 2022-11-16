<template>
    <div class="flex flex-row w-48">
        <div>
            <el-button
                @click="play"
                type="success"
                size="small"
                class="w-10"
                :class="{
                    'transition duration-500 ease-in-out blinking bg-orange-500 border-orange-500':
                        disablePlay,
                }"
            >
                <i class="fas fa-play"></i>
            </el-button>
        </div>
        <div v-if="sources.length && mediaType === 'audio'">
            <audio ref="mediaElement" @canplay.once="playSegment">
                <source :src="source" v-for="(source, idx) of sources" :key="idx" />
                Your browser does not support the <code>audio</code> element.
            </audio>
        </div>
        <div v-if="sources.length && mediaType === 'video'" class="w-64">
            <video ref="mediaElement" @canplay.once="playSegment">
                <source :src="source" v-for="(source, idx) of sources" :key="idx" />
                Your browser does not support the <code>video</code> element.
            </video>
        </div>
    </div>
</template>

<script>
// import { DataLoader, determineDataTypes } from "src/services/data-loader.service";
// const dataLoader = new DataLoader();
import { compact, cloneDeep } from "lodash";

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
            const identifier = this.item.resource;
            const ocflVersion = this.item.ocflVersion;
            const params = {
                identifier,
                version: ocflVersion,
                configuration: this.$store.state.configuration,
            };
            let ocflObject;
            try {
                ocflObject = await dataLoader.load({ ...params });
            } catch (error) {
                console.error(`Unable to load the object with id ${this.item.identifier}`);
                return;
            }

            const fileBasename = this.item.file.split(".").shift();
            let types = determineDataTypes({
                configuration: this.$store.state.configuration,
                crate: ocflObject.rocrate,
            });

            let mediaElements;
            const audioElements = types.audio.filter((m) => m.split(".").shift() === fileBasename);
            if (audioElements.length) {
                this.mediaType = "audio";
                mediaElements = audioElements;
            }
            const videoElements = types.video.filter((m) => m.split(".").shift() === fileBasename);
            if (videoElements.length) {
                this.mediaType = "video";
                mediaElements = videoElements;
            }

            let datafiles = cloneDeep(ocflObject.datafiles);
            datafiles = mediaElements.map((e) => {
                let instance = datafiles[e].filter((f) => f.version === ocflVersion)[0];
                if (!instance) {
                    instance = datafiles[e].pop();
                }
                return instance.path;
            });
            datafiles = compact(datafiles);

            if (datafiles.length) {
                this.sources = datafiles;
                this.disablePlay = true;
            }
        },
        playSegment() {
            this.$refs.mediaElement.currentTime = this.item.timeBegin;
            this.$refs.mediaElement.play();
            setTimeout(async () => {
                this.$refs.mediaElement.pause();
                this.sources = [];
                await new Promise((resolve) => setTimeout(resolve, 200));
                this.disablePlay = false;
            }, (this.item.timeEnd - this.item.timeBegin) * 1000);
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
        @apply bg-yellow-800 border-yellow-800;
    }
}
</style>
