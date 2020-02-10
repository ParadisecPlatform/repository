<template>
    <div>
        <el-select
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
                this.aggregations = (
                    await this.ss.aggregateOverField({
                        ...this.field.aggregate,
                        size: this.aggregationSize
                    })
                )[this.field.field];
            }
        },
        emitSelection() {
            this.$emit("change", {
                ...this.field,
                value: this.value,
                type: "text"
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>