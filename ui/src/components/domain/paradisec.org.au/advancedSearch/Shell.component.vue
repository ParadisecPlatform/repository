<template>
    <div class="flex flex-row">
        <div class="flex flex-col w-1/2">
            <matcher-component
                type="must"
                label="Must"
                @update="updateQuery"
                class="bg-green-300 m-1"
            />
            <matcher-component
                type="should"
                label="Should"
                @update="updateQuery"
                class="bg-orange-300 m-1"
            />
            <matcher-component
                type="mustNot"
                label="Must not"
                @update="updateQuery"
                class="bg-red-300 m-1"
            />
            <div class="flex flex-row m-1">
                <div class="flex-grow">
                    <el-button type="success" @click="search" size="small" class="float-right">
                        <i class="fas fa-search"></i>
                        Search
                    </el-button>
                </div>
            </div>
            <div class="flex flex-col p-4">
                <pre>{{query.query.bool}}</pre>
            </div>
        </div>
        <div class="p-4 px-8 w-1/2">
            <search-results-component :results="results" />
        </div>
    </div>
</template>

<script>
import FieldSelectorComponent from "./FieldSelector.component.vue";
import SearchResultsComponent from "../shared/SearchResults.component.vue";
import MatcherComponent from "./Matcher.component.vue";
import { SearchService } from "../search.service";
import { uniqBy, compact } from "lodash";

export default {
    components: {
        FieldSelectorComponent,
        SearchResultsComponent,
        MatcherComponent
    },
    data() {
        return {
            query: {
                size: 10,
                query: {
                    bool: {
                        must: [],
                        should: [],
                        mustNot: []
                    }
                }
            },
            results: {},
            must: [],
            mustNot: []
        };
    },
    mounted() {
        this.ss = new SearchService({ store: this.$store });
        this.search();
    },
    methods: {
        updateQuery(data) {
            this.query.query.bool[data.type] = compact(data.filters);
            this.search();
        },
        async search() {
            this.results = await this.ss.execute({ query: this.query });
        }
    }
};
</script>

<style lang="scss" scoped></style>
