<template>
    <div class="flex flex-col">
        <matcher-component @search="updateQuery" />
        <div class="style-results-section overflow-scroll mt-2">
            <search-results-component :results="results" @update-search="search" class="mx-2 px-6" />
        </div>
    </div>
</template>

<script>
import MatcherComponent from "./Matcher.component.vue";
import SearchResultsComponent from ".//SearchResults.component.vue";
import { SearchService } from "components/shared/search.service";
import { uniqBy, compact } from "lodash";

export default {
    components: {
        MatcherComponent,
        SearchResultsComponent
    },
    data() {
        return {
            query: {
                size: 10,
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    [`${this.$store.state.configuration.indexerMetadataNamespace}:type`]: "segment"
                                }
                            }
                        ],
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
    beforeMount() {
        this.ss = new SearchService({ store: this.$store });
        this.search({});
    },
    methods: {
        updateQuery(data) {
            this.query.query.bool.must = this.query.query.bool.must.slice(0, 1);
            if (data.value)
                this.query.query.bool.must.push(this.ss.queryBuilder(data));
            this.search({});
        },

        async search({ page = 0, size = 10 }) {
            const query = { ...this.query, from: page * size, size: size };
            this.results = { ...(await this.ss.execute({ query })) };
        }
    }
};
</script>

<style lang="scss" scoped>
.style-results-section {
    height: calc(100vh - 210px);
}
</style>
