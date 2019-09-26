<template>
    <div class="flex flex-col">
        <el-radio-group
            v-model="selectedTranscription"
            @change="loadTranscription"
            class="flex flex-row flex-wrap my-4"
        >
            <el-radio
                v-for="(transcription, idx) of transcriptions"
                :key="idx"
                :label="transcription"
            >{{transcription.name}}</el-radio>
        </el-radio-group>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();

export default {
    props: {
        transcriptions: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            selectedTranscription: this.transcriptions[0]
        };
    },
    methods: {
        loadTranscription(transcription) {
            this.$emit("load-transcription", transcription);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-transcription {
    height: 400px;
    overflow: scroll;
}
</style>