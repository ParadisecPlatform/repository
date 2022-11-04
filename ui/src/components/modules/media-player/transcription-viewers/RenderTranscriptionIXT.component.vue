<template>
    <div>
        <div
            v-for="(phrase, idx) of transcription.segments.phrases"
            :key="idx"
            :id="phrase.id"
            class="p-2"
            :class="{ 'bg-stone-100': highlightSegmentId === phrase.id }"
        >
            <div>
                <el-button @click="playSegment(phrase)">
                    <i class="fas fa-play"></i>&nbsp; PLAY ({{ format(phrase.time.begin) }})
                </el-button>
            </div>
            <div class="style-text">{{ phrase.transcription }}</div>
            <div>{{ phrase.translation }}</div>
            <div class="flex flex-row flex-wrap">
                <div v-for="(word, widx) of phrase.words" :key="widx">
                    <div class="flex flex-row">
                        <div class="flex flex-col p-2 border-2 m-1">
                            <div class="py-2 text-orange-500">
                                {{ word.word }}
                            </div>
                            <div class="flex flex-row">
                                <div
                                    v-for="(m, midx) of word.morphemes.filter(
                                        (m) => m.type === 'morpheme'
                                    )"
                                    :key="midx"
                                    class="mr-1"
                                >
                                    {{ m.text }}
                                </div>
                            </div>
                            <div class="flex flex-row">
                                <div
                                    v-for="(m, midx) of word.morphemes.filter(
                                        (m) => m.type === 'gloss'
                                    )"
                                    :key="midx"
                                    class="mr-1"
                                >
                                    {{ m.text }}
                                </div>
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
    mixins: [mixin],
};
</script>

<style lang="scss" scoped></style>
