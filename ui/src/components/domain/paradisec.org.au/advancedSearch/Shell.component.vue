<template>
    <div>
        <advanced-search-component :must="must" :fields="fields" />
    </div>
</template>

<script>
import AdvancedSearchComponent from "components/shared/advancedSearch/Shell.component.vue";
import { termQuery } from "@coedl/elastic-query-builder/queries";
export default {
    components: {
        AdvancedSearchComponent,
    },
    data() {
        return {
            must: [
                termQuery({
                    field: `${this.$store.state.configuration.indexerMetadataNamespace}:type`,
                    value: "document",
                }),
                termQuery({
                    field: "@type.keyword",
                    value: "Dataset",
                }),
            ],
            fields: [
                {
                    label: "Name",
                    field: "name",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                {
                    label: "Description",
                    field: "description",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                {
                    label: "Contributor Name",
                    field: "contributor.name",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                // {
                //     label: "Type",
                //     field: "additionalType",
                //     type: "select",
                // },
                // {
                //     label: "Private",
                //     field: "private.keyword",
                //     type: "select",
                // },
                // {
                //     label: "Contributor",
                //     path: "contributor",
                //     type: "multi",
                //     nested: true,
                //     fields: [
                //         {
                //             nested: true,
                //             label: "name",
                //             path: "contributor",
                //             field: "name",
                //             type: "text",
                //         },
                //         {
                //             nested: true,
                //             label: "role",
                //             path: "contributor",
                //             field: "role.raw",
                //             type: "select",
                //         },
                //     ],
                // },
                // {
                //     nested: true,
                //     label: "License",
                //     path: "license",
                //     type: "multi",
                //     fields: [
                //         {
                //             nested: true,
                //             label: "name",
                //             path: "license",
                //             field: "name.raw",
                //             type: "select",
                //         },
                //     ],
                // },
                // {
                //     label: "Date Created",
                //     field: "dateCreated",
                //     type: "date",
                // },
                // {
                //     label: "Date Modified",
                //     field: "dateModified",
                //     type: "date",
                // },
                // {
                //     label: "Comments",
                //     field: "comments",
                //     type: "text",
                // },
                // {
                //     label: "Ingest Notes",
                //     field: "ingestNotes",
                //     type: "text",
                // },
                // {
                //     label: "Language As Given",
                //     field: "languageAsGiven",
                //     type: "text",
                // },
                // {
                //     label: "Originated On",
                //     field: "originatedOn",
                //     type: "date",
                // },
                // {
                //     label: "Originated On Narrative",
                //     field: "originatedOnNarrative",
                //     type: "text",
                // },
                // {
                //     label: "Orthographic Notes",
                //     field: "orthographicNotes",
                //     type: "text",
                // },
                // {
                //     label: "University",
                //     path: "publisher",
                //     type: "multi",
                //     nested: true,
                //     fields: [
                //         {
                //             nested: true,
                //             label: "name",
                //             path: "publisher",
                //             field: "name.raw",
                //             type: "select",
                //         },
                //     ],
                // },
                // {
                //     label: "Data Format",
                //     path: "hasPart",
                //     type: "multi",
                //     nested: true,
                //     fields: [
                //         {
                //             nested: true,
                //             label: "Format",
                //             path: "hasPart",
                //             field: "encodingFormat",
                //             type: "select",
                //         },
                //     ],
                // },
            ],
        };
    },
};
</script>

<style lang="scss" scoped></style>
