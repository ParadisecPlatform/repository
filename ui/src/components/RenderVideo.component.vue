<template>
    <div>
        <div v-for="(item, name, idx) of items" :key="idx" class="flex flex-col my-6">
            <div>{{name}}</div>
            <div>
                <video controls ref="videoElement" class="style-video-element">
                    <source :src="video.path" v-for="(video, idx2) of item" :key="idx2" />Your browser does not support the
                    <code>video</code> element.
                </video>
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
.style-video-element {
    max-width: 100%;
}
</style>



