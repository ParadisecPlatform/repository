<template>
    <div class="flex flex-col">
        <div class="flex flex-row" v-for="(field, idx) of fields" :key="idx">
            <div class="w-20 text-right mr-2 leading-loose">{{ field.label }}</div>
            <render-text-field-selector-component
                class="flex-grow"
                :id="id"
                :field="field"
                @change="emitSelection"
                v-if="field.type === 'text'"
            />
            <render-aggregation-field-selector-component
                class="flex-grow"
                :id="id"
                :field="field"
                @change="emitSelection"
                v-if="field.type === 'select'"
            />
        </div>
    </div>
</template>

<script>
import { cloneDeep } from "lodash";
import RenderTextFieldSelectorComponent from "./RenderTextFieldSelector.component.vue";
import RenderAggregationFieldSelectorComponent from "./RenderAggregationFieldSelector.component.vue";
export default {
    components: {
        RenderTextFieldSelectorComponent,
        RenderAggregationFieldSelectorComponent
    },
    props: {
        id: {
            type: Number,
            required: true
        },
        field: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            fields: [],
            state: {}
        };
    },
    beforeMount() {
        this.fields = cloneDeep(this.field.fields);
        this.state = cloneDeep(this.field);
    },
    methods: {
        emitSelection(field) {
            this.state.fields = this.state.fields.map(f => {
                if (f.label === field.label) {
                    f = { ...field };
                }
                return f;
            });
            this.$emit("change", { ...this.state });
        }
    }
};
</script>

<style lang="scss" scoped></style>
