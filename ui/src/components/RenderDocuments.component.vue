<template>
    <div class="flex flex-col">
        <div class="flex flex-col md:flex-row my-3">
            <div class="text-2xl" v-if="files.length">{{files[current].name}}</div>
            <div class="flex-grow"></div>
            <el-pagination
                background
                layout="prev, pager, next"
                :pager-count="pagerCount"
                :total="total"
                :page-size="1"
                @current-change="next"
            ></el-pagination>
        </div>
        <iframe :src="selectedFileUrl" class="style-file-view">
            <p>Your browser does not support iframes.</p>
        </iframe>
        <!-- <iframe
    src="https://docs.google.com/viewer?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true"
    style="width:600px; height:500px;"
    frameborder="0"
        ></iframe>-->
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import Prism from "prismjs";
Prism.highlightAll();

export default {
    props: {
        files: {
            type: Array | undefined,
            required: true
        }
    },
    data() {
        return {
            documents: [],
            fileExtensions: [
                "pdf",
                "doc",
                "docx",
                "xls",
                "xlsx",
                "ppt",
                "pptx"
            ],
            pagerCount: window.innerWidth < 500 ? 5 : 7,
            total: 0,
            current: 0,
            fileContent: "",
            selectedFileUrl: undefined
        };
    },
    mounted() {
        this.total = this.files.length;
        this.setFile();
    },
    methods: {
        setFile() {
            this.selectedFileUrl = `https://docs.google.com/viewer?url=${window.location.origin}${this.files[this.current].path}&embedded=true`;
        },
        next(current) {
            this.current = current - 1;
            this.setFile();
        }
    }
};
</script>

<style lang="scss" scoped>
.style-file-view {
    height: calc(100vh - 250px);
    width: 100%;
}
</style>