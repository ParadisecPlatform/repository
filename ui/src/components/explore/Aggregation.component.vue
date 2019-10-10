<template>
    <div>
        <div class="underline">{{name}}</div>
        <div class="flex flex-col text-base">
            <ol>
                <li v-for="(agg, idx) of aggregations" :key="idx">
                    <a
                        class="text-sm style-filter-selection"
                        @click.stop.prevent="applyAggregation(agg)"
                    >{{agg.key}} ({{agg.doc_count}})</a>
                </li>
            </ol>
        </div>
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
            aggregations: []
        };
    },
    async mounted() {
        this.search = new SearchService({ store: this.$store });
        let aggregations = [];
        switch (this.field) {
            case "domain":
                aggregations = await this.search.aggregateDomains();
                break;
            case "author":
                aggregations = await this.search.aggregateAuthors();
                break;
            case "type":
                aggregations = await this.search.aggregateTypes();
                break;
            case "publisher":
                aggregations = await this.search.aggregatePublishers();
                break;
        }

        this.aggregations = [...aggregations];
    },
    methods: {
        applyAggregation(value) {
            this.search.applyFilter({
                filter: {
                    field: this.field,
                    value: value.key,
                    negate: false
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.style-filter-selection {
    cursor: pointer;
}
</style>