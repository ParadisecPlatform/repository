<template>
    <el-card shadow="never" v-if="images.length">
        <div slot="header" class="text-center">
            <div class="text-center">{{ images[currentImage].displayName }}</div>
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
                    <img :src="images[currentImage].path" />
                </div>
            </div>
        </div>
    </el-card>
</template>

<script>
import { orderBy, compact, cloneDeep } from "lodash";
const { FullScreenViewer } = require("iv-viewer");

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            imageFormats: this.$store.state.configuration.imageFormats,
            images: [],
            currentImage: 0,
            totalImages: undefined
        };
    },
    mounted() {
        this.loadImages();
    },
    methods: {
        loadImages() {
            let images = this.data.objectifiedCrate.hasPart.filter(file =>
                this.imageFormats.includes(file.encodingFormat)
            );
            const datafiles = cloneDeep(this.data.datafiles);
            images = images.map(image => {
                if (!datafiles[image.name]) return undefined;
                return {
                    ...image,
                    path: datafiles[image.name].pop().path
                };
            });
            images = compact(images);
            this.images = orderBy(images, "name");
            this.totalImages = images.length;
        },
        update(number) {
            this.currentImage = number - 1;
        },
        toggleFullScreen() {
            const viewer = new FullScreenViewer({});
            viewer.show(this.images[this.currentImage].path);
        }
    }
};
</script>

<style lang="scss" scoped></style>
