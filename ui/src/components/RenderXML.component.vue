<template>
    <div class="flex flex-col">
        <div class="flex flex-col md:flex-row my-3">
            <div class="text-2xl" v-if="xmlFiles.length">{{xmlFiles[current].name}}</div>
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
        <pre class="style-file-view">
        <code v-html="fileContent"></code>
    </pre>
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
            xmlFiles: [],
            pagerCount: window.innerWidth < 500 ? 5 : 7,
            total: 0,
            current: 0,
            fileContent: ""
        };
    },
    mounted() {
        this.xmlFiles = this.files.filter(
            file => file.encodingFormat === "application/xml"
        );
        this.total = this.xmlFiles.length;
        this.highlight();
    },
    methods: {
        async highlight() {
            let file = this.xmlFiles[this.current];
            let data = await load({ file });
            this.fileContent = Prism.highlight(
                data,
                Prism.languages.xml,
                "xml"
            );

            async function load({ file }) {
                try {
                    return await dataLoader.loadFile({ file });
                } catch (error) {
                    console.log(error);
                }
            }
        },
        next(current) {
            this.current = current - 1;
            this.highlight();
        }
    }
};
</script>

<style lang="scss" scoped>
.style-file-view {
    background-color: black;
    height: calc(100vh - 250px);
    overflow: scroll;
}
</style>