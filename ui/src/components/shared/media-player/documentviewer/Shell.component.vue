<template>
    <div class="flex flex-col">
        <div class="flex flex-col md:flex-row my-3">
            <div class="text-xl" v-if="documents.length">{{ documents[current].name }}</div>
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
import { getFilesByName } from "../lib";
import { cloneDeep, compact } from "lodash";

export default {
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
            current: 0,
            fileContent: "",
            selectedFileUrl: undefined,
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
            console.log(documents);

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
            if (this.total) this.setFile();
        },
        setFile() {
            this.selectedFileUrl = `https://docs.google.com/viewer?url=${window.location.origin}${
                this.documents[this.current].path
            }&embedded=true`;
        },
        next(current) {
            this.current = current - 1;
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
