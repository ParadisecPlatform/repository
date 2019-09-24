<template>
    <div>
        <div class="text-center">
            <el-form ref="form" :model="form" :inline="true" @submit.native.prevent>
                <el-form-item>
                    <el-autocomplete
                        v-model="text"
                        :fetch-suggestions="querySearch"
                        :clearable="true"
                        placeholder="Please input"
                        class="style-input"
                        @select="handleSelect"
                    >
                        <template slot-scope="{ item }">
                            <span
                                style="float: left"
                                v-if="item.type === 'collection'"
                                class="style-collection-result"
                            >{{ item.name}}</span>
                            <span
                                style="float: left"
                                v-if="item.type === 'item'"
                                class="style-item-result"
                            >{{ item.name}}</span>
                            <span
                                style="float: right; color: #8492a6; font-size: 13px"
                            >{{item.type}}: {{ item.id}}</span>
                        </template>
                    </el-autocomplete>
                </el-form-item>
                <div
                    class="text-sm text-gray-600"
                >* This will search both the name and description of collections and items.</div>
            </el-form>
        </div>
        <div class="mt-6">Results ({{results.total}})</div>
        <div class="flex flex-col">
            <ol>
                <li v-for="(document, idx) of results.documents" :key="idx">
                    {{document}}
                    <router-link :to="document">{{document}}</router-link>
                </li>
            </ol>
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
    color: $brand-highlight-color;
}
</style>