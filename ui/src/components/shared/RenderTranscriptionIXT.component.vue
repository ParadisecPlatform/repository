<template>
    <div>
        <div
            v-for="(phrase, idx) of transcription.segments.phrases"
            :key="idx"
            :id="phrase.id"
            class="p-2"
            :class="{ 'bg-yellow-200': highlightSegmentId === phrase.id}"
        >
            <div>
                <el-button @click="playSegment(phrase)" size="small">
                    <i class="fas fa-play"></i>
                    PLAY ({{ format(phrase.time.begin) }})
                </el-button>
            </div>
            <div class="style-text">{{ phrase.transcription }}</div>
            <div>{{ phrase.translation }}</div>
            <div class="flex flex-row flex-wrap">
                <div v-for="(word, widx) of phrase.words" :key="widx">
                    <div class="flex flex-row">
                        <div class="flex flex-col p-2 border-2 m-1">
                            <div class="py-2 text-orange-500">{{word.word}}</div>
                            <div class="flex flex-row">
                                <div
                                    v-for="(m, midx) of word.morphemes.filter(m => m.type === 'morpheme')"
                                    :key="midx"
                                    class="mr-1"
                                >{{m.text}}</div>
                            </div>
                            <div class="flex flex-row">
                                <div
                                    v-for="(m, midx) of word.morphemes.filter(m => m.type === 'gloss')"
                                    :key="midx"
                                    class="mr-1"
                                >{{m.text}}</div>
                            </div>
                        </div>
                    </div>
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
