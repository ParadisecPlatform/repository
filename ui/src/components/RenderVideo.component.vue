<template>
    <el-card shadow="never">
        <div slot="header" class="text-center">
            <div>{{name}}</div>
        </div>
        <div class="flex flex-col my-6">
            <div>{{name}}</div>
            <div>
                <video controls ref="videoElement" class="style-video-element">
                    <source :src="video.path" v-for="(video, idx2) of item" :key="idx2" />Your browser does not support the
                    <code>video</code> element.
                </video>
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
.style-video-element {
    max-width: 100%;
}
</style>



