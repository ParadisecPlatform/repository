<template>
    <div class="flex flex-col">
        <matcher-component @search="updateQuery" />
        <div class="style-results-section overflow-scroll mt-2">
            <search-results-component
                @update-search="search"
                :results="results"
                class="mx-2 px-6"
            />
        </div>
    </div>
</template>

<script>
import MatcherComponent from "./Matcher.component.vue";
import SearchResultsComponent from ".//SearchResults.component.vue";
import { SearchService } from "components/shared/search.service";
import { isUndefined, isNull, compact } from "lodash";

export default {
    components: {
        MatcherComponent,
        SearchResultsComponent,
    },
    data() {
        return {
            page: 0,
            query: {
                size: 10,
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    [`${this.$store.state.configuration.indexerMetadataNamespace}:type`]: "segment",
                                },
                            },
                        ],
                        should: [],
                        mustNot: [],
                    },
                },
            },
            results: {},
            must: [],
            mustNot: [],
        };
    },
    beforeMount() {
        this.page = this.$route.query?.page ? parseInt(this.$route.query.page) - 1 : 0;
        console.log("this.page at mount", this.page);
        this.ss = new SearchService({ store: this.$store });
        this.search({});
    },
    methods: {
        updateQuery(data) {
            this.query.query.bool.must = this.query.query.bool.must.slice(0, 1);
            if (data.value) this.query.query.bool.must.push(this.ss.queryBuilder(data));
            this.search({});
        },

        async search({ page, size = 10 }) {
            console.log("set page", page);
            this.page = isUndefined(page) || isNull(page) ? this.page : page;
            const query = { ...this.query, from: this.page * size, size: size };
            this.results = { ...(await this.ss.execute({ query })) };
            if (this.$route.query?.page != this.page + 1) {
                this.$router.replace({ query: { page: this.page + 1 } });
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.style-results-section {
    height: calc(100vh - 210px);
}
</style>
