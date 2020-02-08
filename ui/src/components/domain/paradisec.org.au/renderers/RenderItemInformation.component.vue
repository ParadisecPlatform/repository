<template>
    <div>
        <el-button size="mini" @click="showItemInformation = !showItemInformation">
            <span v-show="showItemInformation">hide</span>
            <span v-show="!showItemInformation">show</span>
            item metadata
        </el-button>
        <div class="flex flex-col my-2 bg-yellow-300 p-4 rounded-lg" v-if="showItemInformation">
            <div v-for="(field, idx) of fields" :key="idx" class="flex flex-row">
                <div class="text-orange-900 font-light">{{ field.label }}: &nbsp;</div>
                <div
                    class="text-gray-700 font-normal tracking-wide"
                    v-if="field.prop && field.prop.length"
                >{{ field.prop }}</div>
            </div>

            <!-- contentLanguages -->
            <!-- subjectLanguages -->
        </div>
    </div>
</template>

<script>
import { date, toBoolean } from "src/filters";
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showItemInformation: false,
            fields: [
                {
                    label: "Date Created",
                    prop: date(this.data.objectifiedCrate.dateCreated)
                },
                {
                    label: "Last Update",
                    prop: date(this.data.objectifiedCrate.dateModified)
                },
                {
                    label: "Born Digital",
                    prop: toBoolean(this.data.objectifiedCrate.bornDigital)
                },
                {
                    label: "Cite As",
                    prop: this.data.objectifiedCrate.citeAs
                },
                {
                    label: "Dialect",
                    prop: this.data.objectifiedCrate.dialect
                },
                {
                    label: "Digitised On",
                    prop: date(this.data.objectifiedCrate.digitisedOn)
                },
                {
                    label: "Discourse Type",
                    prop: this.data.objectifiedCrate.discourseType
                },
                {
                    label: "External",
                    prop: toBoolean(this.data.objectifiedCrate.external)
                },
                {
                    label: "Ingest Notes",
                    prop: this.data.objectifiedCrate.ingestNotes
                },
                {
                    label: "Language As Given",
                    prop: this.data.objectifiedCrate.languageAsGiven
                },
                {
                    label: "Originated On",
                    prop: this.data.objectifiedCrate.originatedOn
                },
                {
                    label: "Originated On Narrative",
                    prop: this.data.objectifiedCrate.originatedOnNarrative
                },
                {
                    label: "Private",
                    prop: toBoolean(this.data.objectifiedCrate.private)
                },
                {
                    label: "Received On",
                    prop: this.data.objectifiedCrate.receivedOn
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped></style>
