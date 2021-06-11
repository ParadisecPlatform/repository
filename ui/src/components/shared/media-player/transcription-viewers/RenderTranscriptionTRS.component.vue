<template>
    <div class="flex flex-col">
        <div
            v-for="(episode, eidx) of transcription.segments.episodes"
            :key="eidx"
            class="flex flex-col"
        >
            <div
                v-for="(section, sidx) of episode.sections"
                :key="sidx"
                class="flex flex-col"
            >
                <div
                    v-for="(turn, tidx) of section.turns"
                    :key="tidx"
                    :id="turn.id"
                    class="flex flex-row my-1 p-3 "
                    :class="{
                        'bg-yellow-200': highlightSegmentId === turn.id
                    }"
                >
                    <div class="mr-2 text-center">
                        <el-button @click="playSegment(turn)" size="small">
                            <i class="fas fa-play"></i>
                            PLAY ({{ format(turn.time.begin) }})
                        </el-button>
                    </div>
                    <div class="text-orange-500">{{ turn.text }}</div>
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

<style lang="scss" scoped></style>
