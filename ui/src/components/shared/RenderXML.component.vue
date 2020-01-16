<template>
    <div class="flex flex-col">
        <div class="flex flex-col md:flex-row my-3">
            <div class="text-xl" v-if="documents.length">{{documents[current].name}}</div>
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
import { cloneDeep, compact, orderBy, groupBy } from "lodash";

import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import Prism from "prismjs";
Prism.highlightAll();

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            documents: [],
            pagerCount: window.innerWidth < 500 ? 5 : 7,
            total: 0,
            current: 0,
            fileContent: "",
            loading: false
        };
    },
    mounted() {
        this.loadDocuments();
    },
    methods: {
        loadDocuments() {
            let documents = this.data.objectifiedCrate.hasPart.filter(
                file => file.encodingFormat === "application/xml"
            );

            const datafiles = cloneDeep(this.data.datafiles);
            documents = documents.map(d => {
                if (!datafiles[d.name]) return undefined;

                return {
                    ...d,
                    path: datafiles[d.name].pop().path
                };
            });
            documents = compact(documents);
            this.documents = documents;
            this.total = this.documents.length;
            if (this.total) this.highlight();
        },
        async highlight() {
            let file = this.documents[this.current];
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