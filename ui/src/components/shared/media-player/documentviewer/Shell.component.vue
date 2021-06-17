<template>
    <div class="flex flex-col">
        <div class="flex flex-col md:flex-row md:space-x-2 my-3">
            <div class="text-xl" v-if="documents.length">{{ selectedName }}</div>
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
import { getFilesByName } from "../lib";
import { cloneDeep, compact } from "lodash";
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
            documents: [],
            pagerCount: window.innerWidth < 500 ? 5 : 7,
            total: 0,
            current: 1,
            fileContent: "",
            selectedFileUrl: undefined,
            selectedName: undefined,
            itemLink: undefined,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let documents = getFilesByName({
                rocrate: this.data.rocrate,
                formats: this.$store.state.configuration.documentFileExtensions,
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
            if (this.$route.hash && this.$route.query?.type === "document") {
                let docs = this.documents.map((d) => d.name);
                this.current = docs.indexOf(this.$route.hash.replace("#", "")) + 1;
            }
            this.setFile();
        },
        setFile() {
            const file = this.documents[this.current - 1];
            this.selectedFileUrl = `https://docs.google.com/viewer?url=${window.location.origin}${file.path}&embedded=true`;
            this.selectedName = file.name;
            this.$emit("update-route", { hash: file.name, type: "document" });
            this.$nextTick(() => {
                this.itemLink = window.location;
            });
        },
        update(number) {
            this.current = number;
            this.setFile();
        },
    },
};
</script>

<style lang="scss" scoped>
.style-file-view {
    height: calc(100vh - 250px);
    width: 100%;
}
</style>
