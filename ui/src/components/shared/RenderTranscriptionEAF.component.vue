<template>
    <div>
        <!-- {{ transcription.tiers }} -->
        <div
            v-for="(segment, idx) of transcription.segments"
            :key="idx"
            :id="segment.htmlId"
            class="flex flex-col bg-gray-100 py-4 px-2 mb-4"
            :class="{ 'bg-yellow-200': highlightSegmentId === segment.htmlId }"
        >
            <div :id="segment.htmlId"></div>
            <div>
                <div>
                    <el-button @click="playSegment(segment)" size="small">
                        <i class="fas fa-play"></i>
                        PLAY ({{ format(segment.time.begin) }})
                    </el-button>
                </div>
            </div>
            <div
                v-if="segment.value && segment.value.length"
                class="p-1 text-sm"
            >
                {{ segment.value }}
            </div>
            <div class="flex flex-row flex-wrap">
                <div
                    v-for="(child, idx2) of segment.children"
                    :key="idx2"
                    class="border-2 border-orange-500 m-1 p-2"
                >
                    <render-child-component :data="child" class="my-1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mixin } from "./RenderTranscriptionMixins";
import RenderChildComponent from "./RenderTranscriptionEAFChild.component.vue";

export default {
    mixins: [mixin],
    components: { RenderChildComponent }
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
