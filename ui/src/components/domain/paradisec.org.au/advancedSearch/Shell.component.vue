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
                    label: "Title",
                    field: "name",
                    queryType: "matchQuery",
                    fieldType: "text",
                    aggregationField: "name.keyword",
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
                {
                    label: "Date Created",
                    field: "dateCreated",
                    queryType: "rangeQuery",
                    fieldType: "date",
                },
                {
                    label: "Date Modified",
                    field: "dateModified",
                    queryType: "rangeQuery",
                    fieldType: "date",
                },
                {
                    label: "University",
                    field: "publisher.name",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                // {
                //     label: "Private",
                //     field: "private",
                //     queryType: "matchQuery",
                //     fieldType: "text",
                //     aggregationField: "private",
                // },
                {
                    label: "License",
                    field: "license.name",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                {
                    label: "Comments",
                    field: "comments",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                {
                    label: "Ingest Notes",
                    field: "ingestNotes",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                {
                    label: "Language As Given",
                    field: "languageAsGiven",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                {
                    label: "Originated On",
                    field: "originatedOn",
                    queryType: "rangeQuery",
                    fieldType: "date",
                },
                {
                    label: "Originated On Narrative",
                    field: "originatedOnNarrative",
                    queryType: "matchQuery",
                    fieldType: "text",
                },
                {
                    label: "Orthographic Notes",
                    field: "orthographicNotes",
                    queryType: "matchQuery",
                    fieldType: "text",
                },

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
