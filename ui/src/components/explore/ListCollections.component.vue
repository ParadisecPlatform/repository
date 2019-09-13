<template>
    <div class="flex flex-col">
        <div>The following collections have been found in this repository:</div>
        <div v-for="(collection, idx) of collections.results" :key="idx">
            {{collection}}
            <router-link :to="collection">{{collection}}</router-link>
        </div>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
    data() {
        return {
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
            this.collections = await this.searchService.getCollections();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>