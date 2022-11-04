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
import { Query, BoolQuery } from "@coedl/elastic-query-builder";
import { matchQuery, matchPhraseQuery } from "@coedl/elastic-query-builder/queries";
import { execute } from "components/shared/search-builder";

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
            this.$router.replace({ query }).catch((e) => {});
            this.search({ q: query });
        },
        async search({ q }) {
            let boolQuery = this.defaultQuery();
            boolQuery = boolQuery.must(this.must);
            let query = new Query({}).append(boolQuery);
            query.from = (q.page - 1) * this.size;
            query.size = this.size;
            // console.log("elastic query", JSON.stringify(query, null, 2));
            this.results = await execute({
                service: this.$store.state.configuration.service.search,
                index: this.$store.state.configuration.domain,
                query: query.toJSON(),
            });
        },

        defaultQuery() {
            return new BoolQuery().must(
                matchPhraseQuery({
                    field: `${this.$store.state.configuration.indexerMetadataNamespace}:type`,
                    value: "segment",
                })
            );
        },
    },
};
</script>

<style lang="scss" scoped>
.style-results-section {
    height: calc(100vh - 210px);
}
</style>
