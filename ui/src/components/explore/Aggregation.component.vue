<template>
    <div>
        <div class="underline">{{name}}</div>
        <div class="flex flex-col text-base">
            <ol>
                <li v-for="(agg, idx) of aggregations.slice(0,5)" :key="idx">
                    <a
                        class="text-sm style-filter-selection"
                        @click.stop.prevent="applyAggregation(agg)"
                    >{{agg.key}} ({{agg.doc_count}})</a>
                </li>
            </ol>
        </div>
        <a
            href
            @click.stop.prevent="showMore"
            class="hidden md:block text-xs"
            v-if="displayShowMoreToggle"
        >show more</a>

        <el-drawer
            :title="setDrawerTitle()"
            :visible.sync="drawerVisible"
            direction="rtl"
            :before-close="handleDrawClose"
        >
            <div class="style-drawer-content overflow-scroll">
                <ol class="list-decimal px-12 text-sm">
                    <li v-for="(agg, idx) of aggregations" :key="idx">
                        <a
                            class="text-sm style-filter-selection"
                            @click.stop.prevent="applyAggregation(agg)"
                        >{{agg.key}} ({{agg.doc_count}})</a>
                    </li>
                </ol>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { SearchService } from "./search.service";

export default {
    props: {
        name: {
            type: String,
            required: true
        },
        field: {
            type: String,
            required: true,
            validator: val =>
                ["domain", "author", "type", "publisher"].includes(val)
        }
    },
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
            let aggregations = [];
            switch (this.field) {
                case "domain":
                    aggregations = await this.search.aggregateDomains({
                        size
                    });
                    break;
                case "author":
                    aggregations = await this.search.aggregateAuthors({
                        size
                    });
                    break;
                case "type":
                    aggregations = await this.search.aggregateTypes({ size });
                    break;
                case "publisher":
                    aggregations = await this.search.aggregatePublishers({
                        size
                    });
                    break;
            }

            this.aggregations = [...aggregations];
            this.displayShowMoreToggle = !(aggregations.length < 5);
        },
        applyAggregation(value) {
            this.search.applyFilter({
                filter: {
                    field: this.field,
                    value: value.key,
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