<template>
    <div>
        <advanced-search-component :fields="fields" />
    </div>
</template>

<script>
import AdvancedSearchComponent from "components/shared/advancedSearch/Shell.component.vue";

export default {
    components: {
        AdvancedSearchComponent
    },
    data() {
        return {
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
                {
                    label: "Contributor",
                    nested: true,
                    path: "contributor",
                    field: "contributor",
                    type: "multi",
                    subFields: ["name", "role"]
                },
                {
                    label: "License",
                    nested: true,
                    path: "license",
                    field: "license",
                    type: "multi",
                    subFields: ["name", "description"]
                },
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
                },
                {
                    label: "Orthographic Notes",
                    field: "orthographicNotes",
                    type: "text"
                },
                {
                    label: "University",
                    nested: true,
                    path: "publisher",
                    field: "publisher",
                    type: "multi",
                    subFields: ["name"]
                },
                {
                    label: "Data Format",
                    nested: true,
                    path: "hasPart",
                    field: "hasPart",
                    type: "select",
                    aggregate: {
                        nested: true,
                        path: "hasPart",
                        field: "encodingFormat"
                    }
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped></style>
