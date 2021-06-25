<template>
    <div class="flex flex-col">
        <matcher-component @update="update" />
        <div class="style-results-section overflow-scroll mt-2">
            <search-results-component @paginate="paginate" :results="results" class="mx-2 px-6" />
        </div>
    </div>
</template>

<script>
import MatcherComponent from "./Matcher.component.vue";
import SearchResultsComponent from ".//SearchResults.component.vue";
import { SearchService } from "components/shared/search.service";
import { isUndefined, isNull } from "lodash";
import { boolQuery, matchQuery, matchPhraseQuery, execute } from "components/shared/search-builder";

export default {
    components: {
        MatcherComponent,
        SearchResultsComponent,
    },
    data() {
        return {
            page: 1,
            size: 10,
            results: {},
            must: [],
        };
    },
    mounted() {
        this.ss = new SearchService({ store: this.$store });

        // set the page if none defined
        if (!this.$route.query?.page) {
            this.$router.replace({ query: { page: 1 } });
        }

        // run a query on mount with data from url if any defined
        let data = {
            page: this.$route.query.page,
        };
        if (this.$route.query?.q) {
            data.query = this.$route.query.q;
            data.phrase = this.$route.query.phrase === "false" ? false : true;
            data.operator = this.$route.query.operator;
        }
        this.update(data);
    },
    methods: {
        paginate({ page }) {
            let data = { page };
            if (this.$route.query?.q) {
                data.query = this.$route.query.q;
                data.phrase = this.$route.query.phrase === "false" ? false : true;
                data.operator = this.$route.query.operator;
            }
            this.update(data);
        },
        update(data) {
            // console.log("update search results");
            // console.log("data", JSON.stringify(data, null, 2));
            let query;
            if (data.query && data.phrase) {
                query = {
                    page: data.page,
                    q: data.query,
                };
                this.must = [
                    matchPhraseQuery({
                        field: "text",
                        value: data.query,
                    }),
                ];
            } else if (data.query && !data.phrase) {
                query = {
                    page: data.page,
                    q: data.query,
                    phrase: false,
                    operator: data.operator,
                };
                this.must = [
                    matchQuery({
                        field: "text",
                        value: data.query,
                        operator: data.operator,
                    }),
                ];
            } else {
                query = {
                    page: data.page,
                };
                this.must = [];
            }
            // console.log("query", JSON.stringify(query, null, 2));
            this.$router.replace({ query }).catch((e) => {});
            this.search({ query });
        },

        async search({ query }) {
            let elasticQuery = this.defaultQuery();
            elasticQuery.query.bool.must = [...elasticQuery.query.bool.must, ...this.must];
            elasticQuery = { ...elasticQuery, from: (query.page - 1) * this.size, size: this.size };
            // console.log("elastic query", JSON.stringify(elasticQuery, null, 2));
            this.results = await execute({
                service: this.$store.state.configuration.service.search,
                index: this.$store.state.configuration.domain,
                query: elasticQuery,
            });
        },

        defaultQuery() {
            let query = {
                size: 10,
                query: {},
            };
            query.query = { ...boolQuery() };
            query.query.bool.must.push(
                matchQuery({
                    field: `${this.$store.state.configuration.indexerMetadataNamespace}:type`,
                    value: "segment",
                })
            );
            return query;
        },
    },
};
</script>

<style lang="scss" scoped>
.style-results-section {
    height: calc(100vh - 210px);
}
</style>
