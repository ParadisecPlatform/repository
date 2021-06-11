<template>
    <div class="flex flex-col bg-indigo-100 rounded p-4" v-if="images.length">
        <div class="flex flex-col md:flex-row my-2">
            <div>{{ images[current].name }}</div>
            <div class="flex-grow"></div>
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
                <img :src="images[current].path" />
            </div>
        </div>
    </div>
</template>

<script>
import { getFilesByEncoding } from "../lib";
import { orderBy, compact, cloneDeep } from "lodash";
const { FullScreenViewer } = require("iv-viewer");

export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            images: [],
            current: 0,
            totalImages: undefined,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let images = getFilesByEncoding({
                rocrate: this.data.rocrate,
                formats: this.$store.state.configuration.imageFormats,
            });
            const datafiles = cloneDeep(this.data.datafiles);
            images = images.map((image) => {
                if (!datafiles[image.name]) return undefined;
                return {
                    ...image,
                    path: datafiles[image.name].pop().path,
                };
            });
            images = compact(images);
            this.images = orderBy(images, "name");
            this.totalImages = images.length;
        },
        update(number) {
            this.current = number - 1;
        },
        toggleFullScreen() {
            const viewer = new FullScreenViewer({});
            viewer.show(this.images[this.current].path);
        },
    },
};
</script>

<style lang="scss" scoped></style>
