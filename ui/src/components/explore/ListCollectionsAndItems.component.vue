<template>
    <div class="flex flex-col">
        <div>
            The following
            <span v-if="selection === 'collection'">collections</span>
            <span v-else>items</span>&nbsp;have been found in this repository:
        </div>
        <div v-for="(item, idx) of items.results" :key="idx">
            <router-link :to="item">{{item}}</router-link>
        </div>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
    props: {
        selection: {
            type: String,
            required: true,
            validator: val => ["collection", "item"].includes(val)
        }
    },
    data() {
        return {
            items: [],
            collections: []
        };
    },
    async mounted() {
        this.searchService = new SearchService({
            service: this.$store.state.configuration.service.search
        });
        this.runSearch();
    },
    methods: {
        async runSearch() {
            this.items =
                this.selection === "collection"
                    ? await this.searchService.getCollections()
                    : await this.searchService.getItems();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>