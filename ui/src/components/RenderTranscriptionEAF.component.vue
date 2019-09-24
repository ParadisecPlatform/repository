<template>
    <div>
        <div
            v-for="(segment, idx) of transcription.segments"
            :key="idx"
            :id="segment.htmlId"
            class="style-segment p-2"
        >
            <div>
                <el-button @click="playSegment(segment)" size="small">
                    <i class="fas fa-play"></i>
                    PLAY ({{round(segment.time.begin / 100)}})
                </el-button>
            </div>
            <div>
                {{segment.tierId}}
                <div class="p-2 style-text">
                    <div v-for="(value, idx2) of segment.value" :key="idx2">{{value.text}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin } from "./RenderTranscriptionMixins";

export default {
    mixins: [mixin]
};
</script>

<style lang="scss" scoped>
@import "src/assets/variables.scss";

.style-segment {
    border-bottom: 1px solid;
    border-color: #b0bec5;
}

.style-text {
    color: $brand-highlight-color;
}
</style>