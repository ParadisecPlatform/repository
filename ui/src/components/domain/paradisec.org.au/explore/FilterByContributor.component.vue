<template>
    <div>
        <div class="underline">Contributors</div>
        <div class="flex flex-col text-base">
            <ol>
                <li v-for="(agg, idx) of aggregations.slice(0,5)" :key="idx" class="mb-2">
                    role: {{agg.role}}
                    <div class="flex flex-col">
                        <a
                            v-for="(person, idx2) of agg.names"
                            :key="idx2"
                            class="text-sm style-filter-selection ml-4"
                            @click.stop.prevent="applyAggregation({role: agg.role, person: person.key})"
                        >{{person.key}} ({{person.doc_count}})</a>
                    </div>
                </li>
            </ol>
        </div>
        <a
            @click.stop.prevent="showMore"
            class="hidden md:block text-xs"
            v-if="displayShowMoreToggle"
        >show more</a>

        <el-drawer
            title="Filter By Contributor"
            :visible.sync="drawerVisible"
            direction="rtl"
            :before-close="handleDrawClose"
        >
            <div class="style-drawer-content overflow-scroll">
                <ol class="px-12 text-sm">
                    <li v-for="(agg, idx) of aggregations" :key="idx" class="mb-4">
                        <span class="text-xl">role: {{agg.role}}</span>
                        <div class="flex flex-col">
                            <a
                                v-for="(person, idx2) of agg.names"
                                :key="idx2"
                                class="ml-4 text-sm style-filter-selection"
                                @click.stop.prevent="applyAggregation({role: agg.role, person: person.key})"
                            >{{person.key}} ({{person.doc_count}})</a>
                        </div>
                    </li>
                </ol>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
    data() {
        return {
            watchers: {},
            aggregations: [],
            drawerVisible: false,
            displayShowMoreToggle: false
        };
    },
    computed: {
        drawerSize: function() {
            return window.innerWidth <= 1024
                ? "50%"
                : `${(400 / window.innerWidth) * 100}%`;
        },
        searchResults: function() {
            return this.$store.state.search.results;
        }
    },
    async mounted() {
        this.search = new SearchService({ store: this.$store });
        this.loadAggregations({});
        this.watchers.searchResults = this.$watch(
            "searchResults",
            this.loadAggregations
        );
    },
    beforeDestroy() {
        if (this.watchers.searchResults) this.watchers.searchResults();
    },
    methods: {
        async loadAggregations({ size = 5 }) {
            let aggregations = await this.search.aggregateContributors({
                size
            });
            this.aggregations = [...aggregations];
            this.displayShowMoreToggle = !(aggregations.length < 5);
        },
        applyAggregation({ role, person }) {
            // console.log(person, role);
            this.search.applyFilter({
                filter: {
                    field: "contributor",
                    role,
                    value: person,
                    negate: false
                }
            });
        },
        setDrawerTitle() {
            return `Filter by '${this.name}'`;
        },
        showMore() {
            this.drawerVisible = true;
            this.loadAggregations({ size: 100 });
        },
        handleDrawClose() {
            this.loadAggregations({});
            this.drawerVisible = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-filter-selection {
    cursor: pointer;
}

.style-drawer-content {
    height: calc(100vh - 120px);
}
</style>