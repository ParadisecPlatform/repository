<template>
    <div>
        <div v-if="isOnline">
            <list-domains-component />
        </div>
        <div v-else>Uh oh. For one reason or another this is not going to work right now.</div>
    </div>
</template>

<script>
import { DataLoader } from "src/data-loader.service";
const dataLoader = new DataLoader();
import { SearchService } from "./search.service";

import ListDomainsComponent from "./ListDomains.component.vue";
export default {
    components: {
        ListDomainsComponent
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