<template>
    <div class="flex flex-col bg-indigo-100 rounded p-4">
        <div class="flex flex-col md:flex-row md:space-x-2 my-2">
            <div class="" v-if="documents.length">{{ selectedName }}</div>
            <copy-to-clipboard-component :data="itemLink" />
            <div class="flex-grow"></div>
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page.sync="current"
                :pager-count="pagerCount"
                :total="total"
                :page-size="1"
                @current-change="update"
            ></el-pagination>
        </div>
        <pre class="style-file-view">
            <code v-html="fileContent"></code>
        </pre>
    </div>
</template>

<script>
import { getFilesByEncoding } from "../lib";
import { cloneDeep, compact } from "lodash";
import { DataLoader } from "src/services/data-loader.service";
import CopyToClipboardComponent from "src/components/shared/CopyToClipboard.component.vue";

const dataLoader = new DataLoader();
import Prism from "prismjs";
Prism.highlightAll();

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
            documents: [],
            pagerCount: window.innerWidth < 500 ? 5 : 7,
            total: 0,
            current: 1,
            fileContent: "",
            loading: false,
            selectedName: undefined,
            itemLink: undefined,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let documents = getFilesByEncoding({
                rocrate: this.data.rocrate,
                formats: ["application/xml"],
            });

            const datafiles = cloneDeep(this.data.datafiles);
            documents = documents.map((d) => {
                if (!datafiles[d.name]) return undefined;

                return {
                    ...d,
                    path: datafiles[d.name].pop().path,
                };
            });
            documents = compact(documents);
            this.documents = documents;
            this.total = this.documents.length;
            if (this.$route.hash && this.$route.query?.type === "xml") {
                let docs = this.documents.map((d) => d.name);
                this.current = docs.indexOf(this.$route.hash.replace("#", "")) + 1;
            }
            this.highlight();
        },
        async highlight() {
            let file = this.documents[this.current - 1];
            let data = await load({ file });
            this.fileContent = Prism.highlight(data, Prism.languages.xml, "xml");
            this.selectedName = file.name;
            this.$emit("update-route", { hash: file.name, type: "xml" });
            this.$nextTick(() => {
                this.itemLink = window.location;
            });
            async function load({ file }) {
                try {
                    return await dataLoader.loadFile({ file });
                } catch (error) {
                    console.log(error);
                }
            }
        },
        update(number) {
            this.current = number;
            this.highlight();
        },
    },
};
</script>

<style lang="scss" scoped>
.style-file-view {
    background-color: black;
    height: calc(100vh - 250px);
    overflow: scroll;
}
</style>
