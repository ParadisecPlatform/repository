<template>
    <div class="flex flex-col bg-indigo-100 rounded p-4" v-if="images.length">
        <div class="flex flex-col md:flex-row  md:space-x-2 my-2">
            <div>{{ selectedName }}</div>
            <copy-to-clipboard-component :data="itemLink" />
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
import CopyToClipboardComponent from "src/components/shared/CopyToClipboard.component.vue";

export default {
    components: {
        CopyToClipboardComponent,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            images: [],
            current: 1,
            totalImages: undefined,
            selectedName: undefined,
            itemLink: undefined,
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
            if (this.$route.hash && this.$route.query?.type === "image") {
                let images = this.images.map((d) => d.name);
                this.current = images.indexOf(this.$route.hash.replace("#", "")) + 1;
            }
            this.update(this.current);
        },
        update(number) {
            this.current = number;
            const file = this.images[this.current - 1];
            this.selectedName = file.name;
            this.$emit("update-route", { hash: file.name, type: "image" });
            this.$nextTick(() => {
                this.itemLink = window.location;
            });
        },
        toggleFullScreen() {
            const viewer = new FullScreenViewer({});
            const file = this.images[this.current - 1];
            viewer.show(file.path);
        },
    },
};
</script>

<style lang="scss" scoped></style>
