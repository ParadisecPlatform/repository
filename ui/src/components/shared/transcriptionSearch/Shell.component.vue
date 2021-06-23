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
import { isUndefined, isNull } from "lodash";
import { boolQuery, matchQuery, matchPhraseQuery, execute } from "components/shared/search-builder";

export default {
    components: {
        MatcherComponent,
        SearchResultsComponent,
    },
    data() {
        return {
            page: 0,
            results: {},
            must: [],
        };
    },
    beforeMount() {
        this.page = this.$route.query?.page ? parseInt(this.$route.query.page) - 1 : 0;
        this.ss = new SearchService({ store: this.$store });
        this.search({});
    },
    methods: {
        updateQuery(data) {
            if (data.value) {
                if (data.phraseSearch) {
                    this.must = [
                        matchPhraseQuery({
                            field: "text",
                            value: data.value,
                        }),
                    ];
                } else {
                    this.must = [
                        matchQuery({
                            field: "text",
                            value: data.value,
                            operator: data.operator,
                        }),
                    ];
                }
            } else {
                this.must = [];
            }
            this.search({});
        },

        async search({ page, size = 10 }) {
            this.page = isUndefined(page) || isNull(page) ? this.page : page;
            let query = this.defaultQuery();
            query.query.bool.must = [...query.query.bool.must, ...this.must];
            query = { ...query, from: this.page * size, size: size };
            this.results = await execute({
                service: this.$store.state.configuration.service.search,
                query,
                index: this.$store.state.configuration.domain,
            });
            if (this.$route.query?.page != this.page + 1) {
                this.$router.replace({ query: { page: this.page + 1 } });
            }
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
