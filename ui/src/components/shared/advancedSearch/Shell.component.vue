<template>
    <div>
        <div v-if="fieldDataVerifies">
            <div class="flex flex-row">
                <div class="flex flex-col w-1/2">
                    <div
                        class="text-xs mt-2 bg-teal-200 text-black p-2 text-center"
                    >
                        wildcard searches are supported. Try adding '*' to match
                        zero or more characters or '?' to match a single
                        character.
                    </div>
                    <matcher-component
                        type="must"
                        label="Must"
                        :fields="fields"
                        @update="updateQuery"
                        class="bg-green-300"
                    />
                    <matcher-component
                        type="should"
                        label="Should"
                        :fields="fields"
                        @update="updateQuery"
                        class="bg-orange-300"
                    />
                    <matcher-component
                        type="mustNot"
                        label="Must not"
                        :fields="fields"
                        @update="updateQuery"
                        class="bg-red-300"
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
                        <pre>{{ query.query.bool }}</pre>
                    </div>
                </div>
                <div class="pl-16 p-4 px-8 w-1/2">
                    <search-results-component
                        :results="results"
                        @update-search="search"
                    />
                </div>
            </div>
        </div>
        <div v-else>Field data does not verify. Component disabled.</div>
    </div>
</template>

<script>
import FieldSelectorComponent from "./FieldSelector.component.vue";
import SearchResultsComponent from "components/shared/SearchResults.component.vue";
import MatcherComponent from "./Matcher.component.vue";
import { SearchService } from "components/shared/search.service";
import { uniqBy, compact } from "lodash";

export default {
    components: {
        FieldSelectorComponent,
        SearchResultsComponent,
        MatcherComponent
    },
    props: {
        fields: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            fieldDataVerifies: true,
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
        this.verifyFields();
        this.search({});
    },
    methods: {
        verifyFields() {
            this.fieldDataVerifies = this.ss.verifyFields({
                fields: this.fields,
                disableFields: ["enabled"]
            });
        },
        updateQuery(data) {
            this.query.query.bool[data.type] = compact(data.filters);
            this.search({});
        },
        async search({ page = 0, size = 10 }) {
            const query = { ...this.query, from: page * size, size: size };
            this.results = await this.ss.execute({ query });
        }
    }
};
</script>

<style lang="scss" scoped></style>
