<template>
    <div class="flex flex-col">
        <div>The following authors have been found:</div>
        <div v-for="(author, idx) of authors" :key="idx">
            {{ author.key }} ({{ author.doc_count }})
        </div>
    </div>
</template>

<script>
import { SearchService } from "../search.service";

export default {
    data() {
        return {
            authors: []
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
            this.authors = await this.searchService.getAuthors();
        }
    }
};
</script>

<style lang="scss" scoped></style>
