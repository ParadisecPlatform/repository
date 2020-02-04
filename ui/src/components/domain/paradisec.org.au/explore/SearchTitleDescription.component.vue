<template>
    <div>
        <div class="text-center">
            <div>
                <p>Search for an item or collection</p>
            </div>
            <el-form ref="form" :model="form" :inline="true" @submit.native.prevent>
                <el-form-item>
                    <el-autocomplete
                        v-model="text"
                        :fetch-suggestions="querySearch"
                        :clearable="true"
                        placeholder="Search for an item or collection"
                        class="style-input"
                        @select="handleSelect"
                    >
                        <template slot-scope="{ item }">
                            <span
                                class="style-collection-result text-sm md:text-xl"
                                v-if="item.type === 'collection'"
                            >
                                <i class="far fa-clone"></i>
                                {{ item.name}}
                            </span>
                            <span
                                class="style-item-result text-sm md:text-xl"
                                v-if="item.type === 'item'"
                            >
                                <i class="fas fa-chevron-right"></i>
                                {{ item.name}}
                            </span>
                            <span class="text-xs text-gray-500">&nbsp;&nbsp;&nbsp;&nbsp;{{ item.id}}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <div
                    class="text-sm text-gray-600"
                >* This will search both the name and description of collections and items.</div>
                <div class="text-sm text-gray-600">** Try searching "south" or "capell".</div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
    data() {
        return {
            text: "",
            form: {},
            results: {
                documents: [],
                total: 0
            }
        };
    },
    async mounted() {
        this.searchService = new SearchService({
            service: this.$store.state.configuration.service.search
        });
    },
    methods: {
        async querySearch(queryString, cb) {
            if (queryString.length < 3) cb([]);
            const results = await this.searchService.search({
                text: queryString
            });
            cb(results.documents);
        },
        handleSelect(result) {
            this.$router.push({ path: result.id });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "src/assets/variables.scss";

.style-input {
    width: 90vw;
}
@media (min-width: 1024px) {
    .style-input {
        width: 800px;
    }
}
.style-item-result {
    // color: $brand-highlight-color;
}
</style>