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
        <div v-for="(field , idx) of fields" :key="idx" class="flex-grow" v-else>
            <div class="flex flex-col" v-if="field.field === select">
                <div v-if="field.elementType === 'input'" class="w-full">
                    <el-input
                        :type="field.type"
                        v-model="field.value"
                        @change="emitSelection(field)"
                        size="small"
                    ></el-input>
                </div>
                <div v-if="field.elementType === 'date'" class="w-full">
                    <el-date-picker
                        v-model="field.value"
                        type="monthrange"
                        range-separator="-"
                        start-placeholder="Start month"
                        end-placeholder="End month"
                        size="small"
                        align="center"
                        @change="emitSelection(field)"
                    ></el-date-picker>
                </div>
                <div class="text-xs w-full pr-2">{{field.label}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
                    elementType: "input",
                    type: "text"
                },
                {
                    label: "Description",
                    field: "description",
                    elementType: "input",
                    type: "text"
                },
                {
                    label: "Date Created",
                    field: "dateCreated",
                    elementType: "date",
                    type: "date"
                },
                {
                    label: "Date Modified",
                    field: "dateModified",
                    elementType: "date",
                    type: "date"
                },
                {
                    label: "Comments",
                    field: "comments",
                    elementType: "input",
                    type: "text"
                },
                {
                    label: "Ingest Notes",
                    field: "ingestNotes",
                    elementType: "input",
                    type: "text"
                },
                {
                    label: "Language As Given",
                    field: "languageAsGiven",
                    elementType: "input",
                    type: "text"
                },
                {
                    label: "Originated On",
                    field: "originatedOn",
                    elementType: "date",
                    type: "date"
                },
                {
                    label: "Originated On Narrative",
                    field: "originatedOnNarrative",
                    elementType: "input",
                    type: "text"
                }
            ]
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