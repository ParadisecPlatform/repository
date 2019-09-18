<template>
    <el-card>
        <div slot="header" class="text-center">
            <div>{{name}}</div>
        </div>
        <div class="flex flex-col my-6">
            <div>
                <audio controls ref="audioElement" class="style-audio-element">
                    <source :src="audio.path" v-for="(audio, idx2) of item" :key="idx2" />Your browser does not support the
                    <code>audio</code> element.
                </audio>
            </div>
        </div>
    </el-card>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        item: {
            type: Array,
            required: true
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
.style-audio-element {
    width: 100%;
}
</style>



