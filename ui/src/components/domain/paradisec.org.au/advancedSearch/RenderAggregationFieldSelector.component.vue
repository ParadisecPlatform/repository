<template>
    <div>
        <el-select
            ref="dataSelect"
            v-model="value"
            placeholder="Select a field to add to the query"
            class="w-full"
            size="small"
            @change="emitSelection"
        >
            <el-option
                v-for="(aggregation, idx) of aggregations"
                :key="idx"
                :label="aggregation.key"
                :value="aggregation.key"
            >
                <div>{{aggregation.key}} ({{aggregation.doc_count}})</div>
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { SearchService } from "../search.service";

export default {
    props: {
        field: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            value: undefined,
            aggregationSize: 100,
            aggregations: []
        };
    },
    async mounted() {
        this.ss = new SearchService({ store: this.$store });
        await this.loadAggregations();
    },
    methods: {
        async loadAggregations(selection) {
            if (this.field.aggregate) {
                const data = {
                    ...this.field.aggregate,
                    size: this.aggregationSize
                };
                let aggregations = await this.ss.aggregateOverField(data);
                this.aggregations = this.field.aggregate.nested
                    ? aggregations[this.field.aggregate.field]
                    : aggregations[this.field.field];
            }
        },
        emitSelection() {
            this.$emit("change", {
                ...this.field,
                field: this.field.aggregate.nested
                    ? this.field.aggregate.field
                    : this.field.field,
                value: this.value,
                type: "text"
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>