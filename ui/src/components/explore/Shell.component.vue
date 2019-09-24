<template>
    <div>
        <div v-if="isOnline">
            <div class="flex flex-col md:flex-row">
                <list-domains-component class="mt-6 flex-grow" />
                <list-authors-component class="mt-6 flex-grow" />
            </div>
            <div class="flex flex-col md:flex-row">
                <list-collections-and-items-component
                    selection="collection"
                    class="mt-6 flex-grow"
                />
                <list-collections-and-items-component selection="item" class="mt-6 flex-grow" />
            </div>
            <search-component class="mt-6" />
        </div>
        <div v-else>Uh oh. For one reason or another this is not going to work right now.</div>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import { SearchService } from "./search.service";
import ListDomainsComponent from "./ListDomains.component.vue";
import ListAuthorsComponent from "./ListAuthors.component.vue";
import ListCollectionsAndItemsComponent from "./ListCollectionsAndItems.component.vue";
import SearchComponent from "./Search.component.vue";

export default {
    components: {
        ListDomainsComponent,
        ListAuthorsComponent,
        ListCollectionsAndItemsComponent,
        SearchComponent
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