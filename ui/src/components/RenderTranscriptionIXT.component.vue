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
            <div class="style-text">{{segment.transcription}}</div>
            <div>{{segment.translation}}</div>
            <div class="flex flex-row flex-wrap">
                <table
                    v-for="(word, widx) of segment.words"
                    :key="widx"
                    class="mx-2 my-2 style-table"
                >
                    <tbody class="flex flex-col">
                        <tr class="style-cell style-text p-2" v-if="word.text">
                            <td class :colspan="word.words.length">{{word.text}}</td>
                        </tr>
                        <tr class="style-cell style-text p-2" v-if="!word.text">
                            <td class v-for="(w, wcidx) of word.words" :key="wcidx">{{w.text}}</td>
                        </tr>
                        <tr class="style-cell p-2">
                            <td class v-for="(w, wcidx) of word.words" :key="wcidx">{{w.morpheme}}</td>
                        </tr>
                        <tr class="style-cell p-2">
                            <td class v-for="(w, wcidx) of word.words" :key="wcidx">{{w.gloss}}</td>
                        </tr>
                    </tbody>
                </table>
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