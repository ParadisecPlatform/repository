<template>
    <div>
        <div class="flex flex-row">
            <div class="w-30 px-5">Search collections:</div>
            <div class="w-1/2">
                <el-input type="text" v-model="text" placheholder="Search for a collection" />
            </div>
            <div class="w-30">
                <el-button @click="search">search</el-button>
            </div>
        </div>
        <div
            class="text-sm text-gray-600 ml-48"
        >* This will search both the collection name and description.</div>
        <div class="mt-6">Results:</div>
        <div class="flex flex-col">
            Total: {{results.total}}
            <ol>
                <li v-for="(document, idx) of results.documents" :key="idx">
                    <router-link :to="document">{{document}}</router-link>
                </li>
            </ol>
        </div>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
    data() {
        return {
            text: "",
            results: {
                documents: [],
                total: 0
            }
        };
    },
    async mounted() {
        this.searchService = new SearchService({
            service: this.$store.state.configuration.service.search
        });
    },
    methods: {
        async search() {
            this.results = await this.searchService.searchCollections({
                text: this.text
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>