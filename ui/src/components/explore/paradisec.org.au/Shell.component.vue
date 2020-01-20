<template>
    <div>
        <div v-if="isOnline">
            <div class="flex flex-row">
                <div class="fixed" v-if="notPhone">
                    <div class="style-search-controls overflow-scroll px-1">
                        <aggregation-component
                            name="Domain"
                            field="domain"
                            class="mb-4"
                        />
                        <aggregation-component
                            name="Type"
                            field="type"
                            class="mb-4"
                        />
                        <aggregation-component
                            name="Has Content"
                            field="hasContent"
                            class="mb-4"
                        />
                        <filter-by-contributor-component class="mb-4" />
                        <aggregation-component
                            name="Publisher"
                            field="publisher"
                            class="mb-4"
                        />
                        <aggregation-component
                            name="Content Type"
                            field="contentType"
                            class="mb-4"
                        />
                        <filter-by-date-component class="mb-4" />
                        <!-- <advanced-controls-component class="my-5" /> -->
                    </div>
                </div>
                <div
                    class="flex flex-col flex-grow"
                    :class="{ 'style-results': notPhone }"
                >
                    <search-filters-component
                        class="h-32 overflow-scroll"
                        v-if="notPhone"
                    />
                    <search-results-component
                        class="p-4"
                        v-on:update-search="updateSearch"
                    />
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            Oh dear. For one reason or another this is not working right now!
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import { SearchService } from "./search.service";
import AggregationComponent from "./Aggregation.component.vue";
import FilterByDateComponent from "./FilterByDate.component.vue";
import FilterByContributorComponent from "./FilterByContributor.component.vue";
import SearchResultsComponent from "components/shared/SearchResults.component.vue";
import SearchFiltersComponent from "./SearchFilters.component.vue";
import SearchTitleDescriptionComponent from "./SearchTitleDescription.component.vue";

export default {
    components: {
        AggregationComponent,
        FilterByDateComponent,
        FilterByContributorComponent,
        SearchResultsComponent,
        SearchFiltersComponent,
        SearchTitleDescriptionComponent
    },
    data() {
        return {
            notPhone: false
        };
    },
    computed: {
        isOnline: function() {
            return this.$store.state.status.search;
        }
    },
    async mounted() {
        this.notPhone = window.innerWidth >= 768 ? true : false;
        await dataLoader.verifySearchServiceAvailable({
            store: this.$store
        });
        this.search = new SearchService({ store: this.$store });
        this.search.search({ page: 0 });
    },
    methods: {
        updateSearch(params) {
            this.search.search(params);
        }
    }
};
</script>

<style lang="scss" scoped>
.style-search-controls {
    min-width: 355px;
    width: 0px;
    height: 80vh;
}

.style-results {
    margin-left: 365px;
}
</style>
