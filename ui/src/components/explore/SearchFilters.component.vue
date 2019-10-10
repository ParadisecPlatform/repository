
<template>
    <div class="flex flex-col border-solid border-b-2 border-gray-200 p-4">
        <div class="text-sm underline mb-2">Applied filters (click to negate)</div>
        <div class="flex flex-row flex-wrap">
            <el-tag
                class="m-1"
                type="success"
                closable
                @close="removeFilter(must)"
                @click="negateFilter(must)"
                v-for="must of mustFilters"
                :key="must.id"
            >{{must.field}}: {{must.value}}</el-tag>
            <el-tag
                class="m-1"
                type="danger"
                closable
                @close="removeFilter(mustNot)"
                @click="negateFilter(mustNot)"
                v-for="mustNot of mustNotFilters"
                :key="mustNot.id"
            >NOT - {{mustNot.field}}: {{mustNot.value}}</el-tag>
        </div>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
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
        }
    }
};
</script>

<style lang="scss" scoped>
</style>