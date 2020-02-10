<template>
    <div class="flex flex-col">
        <div class="flex-grow" v-if="!select">
            <el-select
                v-model="select"
                placeholder="Select a field to add to the query"
                class="w-full"
                size="small"
            >
                <el-option
                    v-for="(field, idx) of fields"
                    :key="idx"
                    :label="field.label"
                    :value="field.field"
                ></el-option>
            </el-select>
        </div>
        <div v-for="(f, idx) of fields" :key="idx" class="flex-grow" v-else>
            <div class="flex flex-col" v-if="f.field === select">
                <div v-if="f.type=== 'text'" class="w-full">
                    <render-text-field-selector-component :field="f" @change="emitSelection" />
                </div>
                <div v-if="f.type === 'date'" class="w-full">
                    <render-date-field-selector-component :field="f" @change="emitSelection" />
                </div>
                <div v-if="f.type === 'select'" class="w-full">
                    <render-aggregation-field-selector-component
                        :field="f"
                        @change="emitSelection"
                    />
                </div>
                <div class="text-xs w-full pr-2">{{f.label}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import RenderTextFieldSelectorComponent from "./RenderTextFieldSelector.component.vue";
import RenderDateFieldSelectorComponent from "./RenderDateFieldSelector.component.vue";
import RenderAggregationFieldSelectorComponent from "./RenderAggregationFieldSelector.component.vue";

export default {
    components: {
        RenderTextFieldSelectorComponent,
        RenderDateFieldSelectorComponent,
        RenderAggregationFieldSelectorComponent
    },
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            select: undefined,
            fields: [
                {
                    label: "Name",
                    field: "name",
                    type: "text"
                },
                {
                    label: "Description",
                    field: "description",
                    type: "text"
                },
                {
                    label: "Type",
                    field: "additionalType",
                    type: "select",
                    aggregate: {
                        field: "additionalType"
                    }
                },
                // {
                //     label: "Contributor",
                //     field: "contributor",
                //     type: "select",
                //     aggregate: {
                //         nested: true,
                //         path: "contributor",
                //         field: "name.raw"
                //     }
                // },
                {
                    label: "Date Created",
                    field: "dateCreated",
                    type: "date"
                },
                {
                    label: "Date Modified",
                    field: "dateModified",
                    type: "date"
                },
                {
                    label: "Comments",
                    field: "comments",
                    type: "text"
                },
                {
                    label: "Ingest Notes",
                    field: "ingestNotes",
                    type: "text"
                },
                {
                    label: "Language As Given",
                    field: "languageAsGiven",
                    type: "text"
                },
                {
                    label: "Originated On",
                    field: "originatedOn",
                    type: "date"
                },
                {
                    label: "Originated On Narrative",
                    field: "originatedOnNarrative",
                    type: "text"
                }
            ],
            aggregations: {}
        };
    },
    methods: {
        emitSelection(field) {
            field = { ...field, id: this.id };
            this.$emit("selected-field", field);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>