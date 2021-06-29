<template>
    <div>
        <div v-if="fieldDataVerifies">
            <div class="flex flex-row">
                <div class="flex flex-col space-y-1 w-1/2">
                    <!-- <div class="text-xs mt-2 bg-teal-200 text-black p-2 text-center">
                        wildcard searches are supported. Try adding '*' to match zero or more
                        characters or '?' to match a single character.
                    </div> -->
                    <matcher-component
                        type="must"
                        label="Must"
                        :field-definitions="fields"
                        @update-search="updateSearch"
                        class="rounded bg-green-300"
                    />
                    <matcher-component
                        type="should"
                        label="Should"
                        :field-definitions="fields"
                        @update-search="updateSearch"
                        class="rounded bg-yellow-400"
                    />
                    <matcher-component
                        type="mustNot"
                        label="Must not"
                        :field-definitions="fields"
                        @update-search="updateSearch"
                        class="rounded bg-red-300"
                    />
                    <div class="flex flex-row mt-1">
                        <div class="flex-grow">
                            <el-button
                                type="success"
                                @click="search"
                                size="small"
                                class="float-right"
                            >
                                <i class="fas fa-search"></i>
                                Search
                            </el-button>
                        </div>
                    </div>
                    <div class="flex flex-col p-4">
                        <!-- <pre>{{ query }}</pre> -->
                    </div>
                </div>
                <div class="pl-16 p-4 px-8 w-1/2">
                    <search-results-component :results="results" @next-page="nextPage" />
                    <!-- <pre>{{ results }}</pre> -->
                </div>
            </div>
        </div>
        <div v-else>Field data does not verify. Component disabled.</div>
    </div>
</template>

<script>
import FieldSelectorComponent from "./FieldSelector.component.vue";
import SearchResultsComponent from "./SearchResults.component.vue";
import MatcherComponent from "./Matcher.component.vue";
import { Query, BoolQuery } from "@coedl/elastic-query-builder";
import { debounce } from "lodash";
import {
    termQuery,
    matchQuery,
    matchPhraseQuery,
    rangeQuery,
    wildcardQuery,
} from "@coedl/elastic-query-builder/queries";
import { execute } from "components/shared/search-builder";

export default {
    components: {
        FieldSelectorComponent,
        SearchResultsComponent,
        MatcherComponent,
    },
    props: {
        fields: {
            type: Array,
            required: true,
        },
        must: {
            type: Array,
            default: () => [],
        },
        should: {
            type: Array,
            default: () => [],
        },
        mustNot: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            fieldDataVerifies: true,
            query: {},
            clauses: {},
            results: {},
            debouncedSearch: debounce(this.search, 500),
        };
    },
    beforeMount() {
        // this.verifyFields();
    },
    methods: {
        verifyFields() {
            // this.fieldDataVerifies = this.ss.verifyFields({
            //     fields: this.fields,
            //     disableFields: ["enabled"],
            // });
        },
        nextPage({ page }) {
            console.log(page);
            this.search({ page });
        },
        updateSearch(update) {
            this.clauses[update.type] = update.clauses;
            this.debouncedSearch({ page: 0 });
        },
        async search({ page }) {
            let query = new Query({});
            let boolQuery = new BoolQuery();

            // assemble must clauses
            if (this.must?.length || this.clauses.must?.length) {
                boolQuery = boolQuery.must(this.assembleQuery(this.clauses.must));
                boolQuery = boolQuery.must(this.must);
            }

            // assemble should clauses
            if (this.should?.length || this.clauses.should?.length) {
                boolQuery = boolQuery.should(this.assembleQuery(this.clauses.should));
                boolQuery = boolQuery.should(this.should);
            }

            // assemble mustNot clauses
            if (this.mustNot?.length || this.clauses.mustNot?.length) {
                boolQuery = boolQuery.mustNot(this.assembleQuery(this.clauses.mustNot));
                boolQuery = boolQuery.mustNot(this.mustNot);
            }
            query.append(boolQuery);
            this.query = query.toJSON();
            this.query.from = page * 10;
            // console.log(JSON.stringify(this.query, null, 2));

            this.results = await execute({
                service: this.$store.state.configuration.service.search,
                index: this.$store.state.configuration.domain,
                query: this.query,
            });
        },

        assembleQuery(clauses) {
            return clauses.map((c) => {
                // console.log(JSON.stringify(c, null, 2));
                switch (c.queryType) {
                    case "matchQuery":
                        return matchQuery({ field: c.field, value: c.value });
                        break;
                    case "rangeQuery": {
                        return rangeQuery({ field: c.field, value: c.value });
                        break;
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
