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
            >
                <el-option
                    v-for="(field, idx) of fields"
                    :key="idx"
                    :label="field.label"
                    :value="field.field || field.path"
                ></el-option>
            </el-select>
        </div>
        <div v-for="(f, idx) of fields" :key="idx" class="flex-grow" v-else>
            <div class="flex flex-col" v-if="[f.field, f.path].includes(select)">
                <div v-if="f.type === 'text'">
                    <render-text-field-selector-component
                        :id="id"
                        :field="f"
                        @change="emitSelection"
                    />
                </div>
                <div v-if="f.type === 'date'">
                    <render-date-field-selector-component
                        :id="id"
                        :field="f"
                        @change="emitSelection"
                    />
                </div>
                <div v-if="f.type === 'select'" class="w-full">
                    <render-aggregation-field-selector-component
                        :id="id"
                        :field="f"
                        @change="emitSelection"
                    />
                </div>
                <div v-if="f.type === 'multi'" class="w-full">
                    <render-multi-text-field-selector-component
                        :id="id"
                        :field="f"
                        @change="emitSelection"
                    />
                </div>
                <div class="text-xs w-full pr-2">{{ f.label }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import RenderTextFieldSelectorComponent from "./RenderTextFieldSelector.component.vue";
import RenderDateFieldSelectorComponent from "./RenderDateFieldSelector.component.vue";
import RenderAggregationFieldSelectorComponent from "./RenderAggregationFieldSelector.component.vue";
import RenderMultiTextFieldSelectorComponent from "./RenderMultiTextFieldSelector.component.vue";

export default {
    components: {
        RenderTextFieldSelectorComponent,
        RenderDateFieldSelectorComponent,
        RenderAggregationFieldSelectorComponent,
        RenderMultiTextFieldSelectorComponent
    },
    props: {
        id: {
            type: Number,
            required: true
        },
        fields: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            select: undefined
        };
    },
    beforeMount() {
        const savedSearch = JSON.parse(sessionStorage.getItem(this.id));
        if (savedSearch) {
            this.select = savedSearch.select;
        }
    },
    methods: {
        emitSelection(field) {
            const savedSearch = JSON.parse(sessionStorage.getItem(this.id));
            savedSearch.select = this.select;
            sessionStorage.setItem(this.id, JSON.stringify(savedSearch));
            field = { ...field, id: this.id };
            this.$emit("selected-field", field);
        }
    }
};
</script>

<style lang="scss" scoped></style>
