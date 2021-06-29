<template>
    <div>
        <el-autocomplete
            ref="autocomplete"
            v-model="value"
            :fetch-suggestions="querySearch"
            :trigger-on-focus="false"
            :select-when-unmatched="true"
            :clearable="false"
            placeholder=""
            class="w-full"
            size="small"
            @select="emitSelection"
        >
            <template slot-scope="{ item }">
                {{ item }}
            </template>
        </el-autocomplete>
    </div>
</template>

<script>
import { mixin } from "./FieldMixins";
import { Query, BoolQuery } from "@coedl/elastic-query-builder";
import { termsAggregation } from "@coedl/elastic-query-builder/aggregations";
import { wildcardQuery } from "@coedl/elastic-query-builder/queries";
import { execute } from "components/shared/search-builder";
import { isString } from "lodash";

export default {
    mixins: [mixin],
    data() {
        return { value: undefined };
    },
    mounted() {
        // this.$refs.inputElement.$refs.input.focus();
    },
    methods: {
        async querySearch(queryString, cb) {
            // if (!queryString) return cb([]);
            // if (queryString?.length < 3) return cb([]);

            let lookupField = this.field.aggregationField
                ? this.field.aggregationField
                : `${this.field.field}.keyword`;
            let query = new Query({})
                .size(0)
                .append(
                    new BoolQuery().filter(
                        wildcardQuery({ field: this.field.field, value: `${queryString}*` })
                    )
                )
                .aggregation(termsAggregation({ name: "agg", field: lookupField }));
            query = query.toJSON();
            // console.log(JSON.stringify(query, null, 2));

            let results = await execute({
                service: this.$store.state.configuration.service.search,
                index: this.$store.state.configuration.domain,
                query,
            });
            // console.log(JSON.stringify(results, null, 2));
            results = results.aggregations.agg.buckets.map((b) => b.key);
            return cb(results);
        },
        emitSelection(selection) {
            if (isString(selection)) {
                this.value = selection;
            } else {
                this.value = selection.value;
            }
            this.$emit("change", {
                ...this.field,
                value: this.value,
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
