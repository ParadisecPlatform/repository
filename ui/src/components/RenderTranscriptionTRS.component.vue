<template>
    <div>
        <div
            v-for="(segment, idx) of transcription.segments"
            :key="idx"
            :id="segment.htmlId"
            class="style-segment"
        >
            <div>
                <el-button @click="playSegment(segment)" size="small">
                    <i class="fas fa-play"></i>
                    PLAY ({{round(segment.time.begin / 100)}})
                </el-button>
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

.style-table {
    font-size: 12px;
    border: 1px solid red;
    border-color: #b0bec5;
}

.style-cell {
    border: 1px solid red;
    border-color: #b0bec5;
}

.style-text {
    color: $brand-highlight-color;
}
</style>