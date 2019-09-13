<template>
    <div>
        <div v-if="isOnline">
            <list-domains-component class="mt-6" />
            <list-authors-component class="mt-6" />
            <list-collections-component class="mt-6" />
            <search-collections-component class="mt-6" />
        </div>
        <div v-else>Uh oh. For one reason or another this is not going to work right now.</div>
    </div>
</template>

<script>
import { DataLoader } from "src/data-loader.service";
const dataLoader = new DataLoader();
import { SearchService } from "./search.service";
import ListDomainsComponent from "./ListDomains.component.vue";
import ListAuthorsComponent from "./ListAuthors.component.vue";
import ListCollectionsComponent from "./ListCollections.component.vue";
import SearchCollectionsComponent from "./SearchCollections.component.vue";

export default {
    components: {
        ListDomainsComponent,
        ListAuthorsComponent,
        ListCollectionsComponent,
        SearchCollectionsComponent
    },
    data() {
        return {};
    },
    computed: {
        isOnline: function() {
            return this.$store.state.status.search;
        }
    },
    async mounted() {
        await dataLoader.verifySearchServiceAvailable({
            service: this.$store.state.configuration.service.search
        });
    }
};
</script>

<style lang="scss" scoped>
</style>