<template>
    <div class="flex flex-col">
        <div class="flex flex-row justify-around my-4 text-center">
            <div class="flex flex-col">
                <div class="text-sm">Collections</div>
                <div class="text-3xl text-orange-500">{{ format(stats.collection) }}</div>
            </div>
            <div class="flex flex-col">
                <div class="text-sm">Items</div>
                <div class="text-3xl text-orange-500">{{ format(stats.item) }}</div>
            </div>
            <div class="flex flex-col">
                <div class="text-sm">Contributors</div>
                <div class="text-3xl text-orange-500">{{ format(stats.contributors) }}</div>
            </div>
            <div class="flex flex-col">
                <div class="text-sm">Universities</div>
                <div class="text-3xl text-orange-500">{{ format(stats.publishers) }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import numeral from "numeral";
import { Query, BoolQuery } from "@coedl/elastic-query-builder";
import {
    termsAggregation,
    cardinalityAggregation,
} from "@coedl/elastic-query-builder/aggregations";
import { execute } from "components/shared/search-builder";

export default {
    data() {
        return {
            show: false,
            stats: {
                collections: undefined,
                items: undefined,
                contributors: undefined,
                publishers: undefined,
            },
            aggs: [
                { path: "@type", field: "keyword" },
                { path: "publisher", field: "name.keyword", size: 10 },
                { path: "contributor", field: "name.keyword", size: 10 },
            ],
        };
    },
    async mounted() {
        this.getStats();
    },
    methods: {
        format(number) {
            return numeral(number).format("0,0");
        },
        async getStats() {
            let aggregations = this.aggs.map((agg) => {
                return [
                    termsAggregation({
                        name: agg.path,
                        field: `${agg.path}.${agg.field}`,
                        size: agg.size,
                    }),
                    cardinalityAggregation({
                        name: `${agg.path}_count`,
                        field: `${agg.path}.${agg.field}`,
                    }),
                ];
            });
            let query = new Query({}).size(0).aggregation(aggregations);
            // console.log(JSON.stringify(query.toJSON(), null, 2));
            let result = await execute({
                service: this.$store.state.configuration.service.search,
                index: this.$store.state.configuration.domain,
                query: query.toJSON(),
            });
            // console.log(JSON.stringify(result.aggregations, null, 2));
            this.stats.collection = result.aggregations["@type"].buckets.filter(
                (b) => b.key === "RepositoryCollection"
            )[0].doc_count;
            this.stats.item = result.aggregations["@type"].buckets.filter(
                (b) => b.key === "RepositoryObject"
            )[0].doc_count;
            this.stats.contributors = result.aggregations.contributor_count.value;
            this.stats.publishers = result.aggregations.publisher_count.value;
        },
    },
};
</script>

<style lang="scss" scoped></style>
