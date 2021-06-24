<template>
    <div class="flex flex-col">
        <el-pagination
            layout="total, prev, pager, next"
            :total="results.total"
            :current-page.sync="page"
            @current-change="update"
            v-if="results.total"
        ></el-pagination>
        <ol class="ml-12">
            <li
                :value="(page - 1) * size + idx + 1"
                class="list-decimal text-xs"
                v-for="(result, idx) of results.documents"
                :key="result._id"
            >
                <render-search-result-component
                    :item="result"
                    class="my-4 p-2 border-solid border-b-2 border-gray-400"
                />
            </li>
        </ol>
        <el-pagination
            layout="total, prev, pager, next"
            :total="results.total"
            :current-page.sync="page"
            @current-change="update"
            v-if="results.total"
        ></el-pagination>
        <div v-if="!results.total" class="text-center">
            There are no results matching those filters.
        </div>
    </div>
</template>

<script>
import RenderSearchResultComponent from "./RenderSearchResult.component.vue";

export default {
    components: {
        RenderSearchResultComponent,
    },
    props: {
        results: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            page: 1,
            size: 10,
        };
    },
    mounted() {
        this.setPage();
    },
    watch: {
        "$route.page": function() {
            this.setPage();
        },
    },
    methods: {
        update(page) {
            this.page = page;
            this.$emit("update-search", { page: this.page - 1 });
        },
        setPage() {
            this.page = this.$route.query?.page ? parseInt(this.$route.query.page) : 1;
        },
    },
};
</script>

<style lang="scss" scoped></style>
