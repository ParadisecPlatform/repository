<template>
    <el-card shadow="never">
        <div slot="header" class="text-center">
            <div class="text-center">{{items[currentImage].image.displayName}}</div>
        </div>
        <div class="flex flex-col justify-center">
            <div class="flex flex-row justify-center">
                <el-pagination
                    :background="true"
                    layout="prev, pager, next"
                    :page-size="1"
                    :total="totalImages"
                    :hide-on-single-page="true"
                    @current-change="update"
                ></el-pagination>
                <el-button @click="toggleFullScreen" size="small">
                    <i class="fas fa-expand fa-fw"></i>
                </el-button>
            </div>
            <div class="mt-4">
                <div>
                    <img :src="items[currentImage].image.path" />
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
const { FullScreenViewer } = require("iv-viewer");

export default {
    props: {
        items: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            currentImage: Object.keys(this.items)[0],
            totalImages: Object.keys(this.items).length,
            imageNames: Object.keys(this.items)
        };
    },
    methods: {
        update(number) {
            this.currentImage = this.imageNames[number - 1];
        },
        toggleFullScreen() {
            const viewer = new FullScreenViewer({});
            const image = this.items[this.currentImage].image;
            viewer.show(image.path);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>