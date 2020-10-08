<template>
    <div>
        <!-- {{ transcription.timeslots.children }} -->
        <div
            v-for="(timeslot, idx) of transcription.timeslots.children"
            :key="idx"
            class="flex flex-col"
        >
            <div
                v-for="(segment, sidx) of timeslot.children"
                :key="sidx"
                class="p-2"
                :class="{
                    'bg-yellow-200': highlightSegmentId === segment.id,
                }"
            >
                <div :id="segment.id" class="pt-2"></div>
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
                    class="p-1 text-sm text-orange-500"
                >
                    {{ segment.value }}
                </div>
                <div
                    class="flex flex-row flex-wrap"
                    v-if="segment.children.length"
                >
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
    </div>
</template>

<script>
import { mixin } from "./RenderTranscriptionMixins";
import RenderChildComponent from "./RenderTranscriptionEAFChild.component.vue";

export default {
    mixins: [mixin],
    components: { RenderChildComponent },
};
</script>

<style lang="scss" scoped></style>
