<template>
    <div>
        <div v-for="(item, idx) of items" :key="idx" class="flex flex-row my-6">
            <div class="w-1/4">{{item[0].displayName}}</div>
            <div class="w-1/2">
                <audio controls ref="audioElement" class="style-audio-element">
                    <source :src="audio.path" v-for="(audio, idx2) of item" :key="idx2" />Your browser does not support the
                    <code>audio</code> element.
                </audio>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
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



