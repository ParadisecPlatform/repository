<template>
    <div class="flex flex-col">
        <div class="flex-grow" v-if="!select">
            <el-select
                ref="typeSelect"
                v-model="select"
                placeholder="Select a field to add to the query"
                class="w-full"
                size="small"
                :filterable="true"
                @change="storeSelection"
            >
                <el-option
                    v-for="(field, idx) of fieldDefinitions"
                    :key="idx"
                    :label="field.label"
                    :value="field.field || field.path"
                ></el-option>
            </el-select>
        </div>
        <div v-for="(f, idx) of fieldDefinitions" :key="idx" class="flex-grow" v-else>
            <div class="flex flex-col" v-if="[f.field, f.path].includes(select)">
                <render-text-lookup-field-selector-component
                    v-if="f.fieldType === 'text'"
                    :id="id"
                    :field="f"
                    @change="emitSelection"
                />
                <render-date-field-selector-component
                    v-if="f.fieldType === 'date'"
                    :id="id"
                    :field="f"
                    @change="emitSelection"
                />
                <!-- <render-aggregation-field-selector-component
                    v-if="f.fieldTtype === 'select'"
                    class="w-full"
                    :id="id"
                    :field="f"
                    @change="emitSelection"
                /> -->
                <!-- <render-multi-text-field-selector-component
                    v-if="f.fieldType === 'multi'"
                    class="w-full"
                    :id="id"
                    :field="f"
                    @change="emitSelection"
                /> -->
                <div class="text-xs w-full pr-2">{{ f.label }}</div>
            </div>
        </div>
    </div>
</template>

<script>
// import RenderTextFieldSelectorComponent from "./RenderTextFieldSelector.component.vue";
import RenderTextLookupFieldSelectorComponent from "./RenderTextLookupFieldSelector.component.vue";
import RenderDateFieldSelectorComponent from "./RenderDateFieldSelector.component.vue";
// import RenderAggregationFieldSelectorComponent from "./RenderAggregationFieldSelector.component.vue";
// import RenderMultiTextFieldSelectorComponent from "./RenderMultiTextFieldSelector.component.vue";

export default {
    components: {
        // RenderTextFieldSelectorComponent,
        RenderTextLookupFieldSelectorComponent,
        RenderDateFieldSelectorComponent,
        // RenderAggregationFieldSelectorComponent,
        // RenderMultiTextFieldSelectorComponent,
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
        fieldDefinitions: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            select: undefined,
            selection: {},
        };
    },
    methods: {
        storeSelection(selection) {
            this.selection = this.fieldDefinitions.filter((f) => f.field === selection)[0];
        },
        emitSelection(field) {
            field = { ...field, ...this.selection, id: this.id };
            this.$emit("update-search", field);
        },
    },
};
</script>

<style lang="scss" scoped></style>
