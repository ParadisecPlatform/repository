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
                :label="toBoolean(aggregation.key)"
                :value="aggregation.key"
            >
                <div>{{ toBoolean(aggregation.key) }}</div>
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { toBoolean } from "src/filters";
import { mixin } from "./FieldMixins";

export default {
    mixins: [mixin],
    data() {
        return {
            value: undefined,
            aggregationSize: 100,
            aggregations: [],
            toBoolean
        };
    },
    mounted() {
        this.loadAggregations();
    },
    methods: {
        async loadAggregations(selection) {
            const data = {
                ...this.field,
                size: this.aggregationSize
            };
            let aggregations = await this.ss.aggregateOverField(data);
            this.aggregations = aggregations[this.field.field];
        },
        emitSelection() {
            this.saveState();
            this.$emit("change", {
                ...this.field,
                value: this.value,
                type: "text"
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
