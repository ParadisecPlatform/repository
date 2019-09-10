<template>
    <div>
        <div v-for="(item, idx) of items" :key="idx" class="flex flex-row my-6">
            <div class="w-1/4">{{item[0].displayName}}</div>
            <div class="w-1/2">
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
.style-video-element {
    max-width: 100%;
}
</style>



