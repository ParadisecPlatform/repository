<template>
    <div class="flex flex-col">
        <el-pagination
            layout="total, prev, pager, next"
            :total="results.total"
            @current-change="update"
            v-if="results.total"
        ></el-pagination>
        <ol>
            <li
                :value="page * size + idx + 1"
                class="list-decimal"
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
            @current-change="update"
            v-if="results.total"
        ></el-pagination>
        <div v-if="!results.total" class="text-center">There are no results matching those filters.</div>
    </div>
</template>

<script>
import RenderSearchResultComponent from "./RenderSearchResult.component.vue";

export default {
    components: {
        RenderSearchResultComponent
    },
    props: {
        results: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            page: 0,
            size: 10
        };
    },
    methods: {
        update(page) {
            this.page = page - 1;
            this.$emit("update-search", { page: this.page });
        }
    }
};
</script>

<style lang="scss" scoped></style>
