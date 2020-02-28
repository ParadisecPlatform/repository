<template>
    <div>
        <el-button
            @click="play"
            :type="buttonType"
            size="small"
            :class="{'bg-orange-500': disablePlay}"
        >
            <i class="fas fa-play"></i>
        </el-button>
        <audio ref="mediaElement" v-if="src" @canplay.once="playSegment">
            <source :src="src" />Your browser does not support the
            <code>audio</code> element.
        </audio>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();

export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            src: undefined,
            disablePlay: false,
            buttonType: "success"
        };
    },
    methods: {
        async play() {
            if (this.disablePlay) return;
            const params = {
                identifier: this.item.segment.identifier,
                configuration: this.$store.state.configuration
            };
            try {
                const ocflObject = await dataLoader.load({ ...params });
                const media = [
                    ...ocflObject.dataTypes.audio
                    // ...ocflObject.dataTypes.video
                ];
                const mediaElement = media.filter(
                    m =>
                        m.split(".").shift() ===
                        this.item.segment.file.split(".").shift()
                )[0];
                const datafile = ocflObject.datafiles[mediaElement][0];
                this.disablePlay = true;
                this.buttonType = "warning";
                if (datafile.path) this.src = datafile.path;
            } catch (error) {
                console.log(error);
            }
        },
        playSegment() {
            this.$refs.mediaElement.currentTime = this.item.segment.timeBegin;
            this.$refs.mediaElement.play();
            setTimeout(async () => {
                this.$refs.mediaElement.pause();
                this.src = undefined;
                await new Promise(resolve => setTimeout(resolve, 200));
                this.disablePlay = false;
                this.buttonType = "success";
            }, (this.item.segment.timeEnd - this.item.segment.timeBegin) * 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>