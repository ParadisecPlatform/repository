<template>
    <div>
        <!-- <div v-if="isOnline">
            <div class="flex flex-col flex-grow items-center">
                <div class="my-4 text-center text-lg">
                    Simple Search
                </div>
                <search-title-description-component />
            </div>
        </div>
        <div v-else class="text-center">
            Oh dear. For one reason or another this is not working right now!
        </div> -->
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import { SearchService } from "../search.service";
// import AggregationComponent from "../shared/Aggregation.component.vue";
// import SearchTitleDescriptionComponent from "../shared/SearchTitleDescription.component.vue";

export default {
    components: {
        // AggregationComponent,
        // SearchTitleDescriptionComponent
    },
    data() {
        return {
            notPhone: false,
            results: []
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
