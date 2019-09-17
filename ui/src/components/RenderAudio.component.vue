<template>
    <div>
        <div v-for="(item, name, idx) of items" :key="idx" class="flex flex-col my-6">
            <div>{{name}}</div>
            <div>
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
            type: Object,
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



