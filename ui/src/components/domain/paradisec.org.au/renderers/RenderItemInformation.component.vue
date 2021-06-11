<template>
    <div>
        <!-- <el-button type="primary" size="mini" @click="showItemInformation = !showItemInformation">
            <span v-show="showItemInformation">hide</span>
            <span v-show="!showItemInformation">show</span>
            item metadata
        </el-button> -->
        <div class="flex flex-col my-2 bg-yellow-300 p-4 rounded-lg" v-if="showItemInformation">
            <div v-for="(field, idx) of fields" :key="idx" class="flex flex-row">
                <div class="w-1/5 text-orange-900 font-light">{{ field.label }}: &nbsp;</div>
                <div
                    class="w-4/5 text-gray-700 font-normal tracking-wide"
                    v-if="field.prop && field.prop.length"
                >
                    {{ field.prop }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { date, toBoolean } from "src/filters";
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showItemInformation: true,
            fields: [
                {
                    label: "DOI",
                    prop: `https://dx.doi.org/${
                        this.item.identifier.filter((i) => i.name === "doi")[0].value
                    }`,
                },
                {
                    label: "Date Created",
                    prop: date(this.item.dateCreated),
                },
                {
                    label: "Last Update",
                    prop: date(this.item.dateModified),
                },
                {
                    label: "Born Digital",
                    prop: toBoolean(this.item.bornDigital),
                },
                {
                    label: "Cite As",
                    prop: this.item.citeAs,
                },
                {
                    label: "Dialect",
                    prop: this.item.dialect,
                },
                {
                    label: "Digitised On",
                    prop: this.item.digitisedOn,
                },
                {
                    label: "Discourse Type",
                    prop: this.item.discourseType,
                },
                {
                    label: "External",
                    prop: toBoolean(this.item.external),
                },
                {
                    label: "Ingest Notes",
                    prop: this.item.ingestNotes,
                },
                {
                    label: "Original Media",
                    prop: this.item.originalMedia,
                },
                {
                    label: "Metadata Exportable",
                    prop: this.item.metadataExportable,
                },
                {
                    label: "Tapes Returned",
                    prop: this.item.tapesReturned,
                },
                {
                    label: "Language As Given",
                    prop: this.item.languageAsGiven,
                },
                {
                    label: "Originated On",
                    prop: this.item.originatedOn,
                },
                {
                    label: "Originated On Narrative",
                    prop: this.item.originatedOnNarrative,
                },
                {
                    label: "Private",
                    prop: toBoolean(this.item.private),
                },
                {
                    label: "Received On",
                    prop: this.item.receivedOn,
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped></style>
