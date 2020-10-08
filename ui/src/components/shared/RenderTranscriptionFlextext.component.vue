<template>
    <div>
        <div
            v-for="(paragraph, idx) of transcription.segments.paragraphs"
            :key="idx"
            class="p-2"
        >
            <div
                v-for="(phrase, pidx) of paragraph.phrases"
                :key="pidx"
                :id="phrase.id"
                class="p-2"
                :class="{ 'bg-yellow-200': highlightSegmentId === phrase.id }"
            >
                <div>
                    <el-button @click="playSegment(phrase)" size="small">
                        <i class="fas fa-play"></i>
                        PLAY ({{ format(phrase.time.begin) }})
                    </el-button>
                </div>
                <div class="text-orange-500">
                    {{ phrase.transcription.text }}
                </div>
                <div>{{ phrase.translation.text }}</div>
                <div class="flex flex-row flex-wrap">
                    <div
                        v-for="(word, widx) of phrase.words"
                        :key="widx"
                        class="flex flex-col m-2 border-2 p-2"
                    >
                        <div
                            v-for="(morpheme, midx) of word.morphemes"
                            :key="midx"
                        >
                            {{ morpheme.text }}
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
