<template>
    <div class="flex flex-col">
        <div>The following domains have data in this catalog:</div>
        <div v-for="(domain, idx) of domains" :key="idx">{{domain.key}} ({{domain.doc_count}})</div>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
    data() {
        return {
            domains: []
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
            this.domains = await this.searchService.getDomains();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>