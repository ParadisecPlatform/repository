
<template>
    <div class="flex flex-col border-solid border-b-2 border-gray-200 p-4">
        <div class="flex flex-row mb-2 text-sm">
            <div class="underline">Applied filters (click to negate)</div>
            <div class="flex flex-grow"></div>
            <div>
                <a href @click.stop.prevent="clearAllFilters" class="mx-8">
                    <i class="fas fa-ban"></i> clear all filters
                </a>
            </div>
        </div>
        <div class="flex flex-row flex-wrap">
            <el-tag
                class="m-1"
                type="success"
                closable
                @close="removeFilter(must)"
                @click="negateFilter(must)"
                v-for="must of mustFilters"
                :key="must.id"
            >
                <search-filter-text-component :data="must" />
            </el-tag>
            <el-tag
                class="m-1"
                type="danger"
                closable
                @close="removeFilter(mustNot)"
                @click="negateFilter(mustNot)"
                v-for="mustNot of mustNotFilters"
                :key="mustNot.id"
            >
                <search-filter-text-component :data="mustNot" type="not" />
            </el-tag>
        </div>
    </div>
</template>

<script>
import { SearchService } from "./search.service";
import { format, parseISO } from "date-fns";
import SearchFilterTextComponent from "./SearchFilterText.component.vue";

export default {
    components: {
        SearchFilterTextComponent
    },
    data() {
        return {};
    },
    computed: {
        mustFilters: function() {
            return this.$store.state.search.filters.filter(f => !f.negate);
        },
        mustNotFilters: function() {
            return this.$store.state.search.filters.filter(f => f.negate);
        }
    },
    async mounted() {
        this.search = new SearchService({ store: this.$store });
    },
    methods: {
        removeFilter(filter) {
            this.search.removeFilter({ filter });
        },
        negateFilter(filter) {
            this.search.negateFilter({ filter });
        },
        clearAllFilters() {
            this.search.clearAllFilters();
        }
    }
};
</script>

<style lang="scss" scoped>
</style>