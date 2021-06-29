<template>
    <div>
        <div class="flex flex-col" v-if="fieldDataVerifies">
            <div class="flex flex-row">
                <div class="flex flex-col flex-grow">
                    <el-autocomplete
                        ref="autocomplete"
                        v-model="text"
                        :fetch-suggestions="querySearch"
                        :clearable="true"
                        placeholder="search both item's and collection's"
                        class="w-full"
                        size="small"
                        @select="handleSelect"
                    >
                        <template slot-scope="{ item }">
                            <!-- <span
                                class="style-collection-result"
                                v-if="item.type.includes('RepositoryCollection')"
                            >
                                <i class="far fa-clone"></i>
                                {{ item.name }}
                            </span>
                            <span
                                class="style-item-result"
                                v-if="item.type.includes('RepositoryObject')"
                            >
                                <i class="fas fa-chevron-right"></i>
                                {{ item.name }}
                            </span> -->
                            {{ item.name }} ({{ item.type.join(", ") }})
                            <!-- <span class="text-gray-500">{{ item.resource }}</span> -->
                        </template>
                    </el-autocomplete>

                    <div class="flex flex-row flex-wrap mt-2">
                        <el-checkbox
                            class="style-component my-0 mx-2"
                            v-for="(field, idx) of fields"
                            :key="idx"
                            v-model="field.enabled"
                            >{{ field.label }}</el-checkbox
                        >
                    </div>
                    <div class="flex flex-row my-2">
                        <div>
                            <el-switch
                                class="style-component"
                                v-model="phrase"
                                active-color="#dd6b20"
                                active-text="phrase search"
                                inactive-text="keyword search"
                            >
                            </el-switch>
                        </div>
                        <div class="flex-grow"></div>
                        <div>
                            <el-switch
                                class="style-component"
                                v-show="!phrase"
                                v-model="operator"
                                active-color="#dd6b20"
                                active-text="AND"
                                active-value="AND"
                                inactive-text="OR"
                                inactive-value="OR"
                            >
                            </el-switch>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-sm">
            Field data does not verify. Component disabled.
        </div>
    </div>
</template>

<script>
/*

    This component takes three properties:

    autofocus: [Boolean] (default: true). Whether or not to autofocus the component on load

    fields: [Array] - the fields to set up and query. Following is an
        example showing two fields - a simple text field query and a nested
        field.


        field = [
            {
                type: "text",
                label: "Description",
                field: "description",
                enabled: true
            },
            {
                label: "Contributor",
                path: "contributor",
                field: "name",
                nested: true,
                enabled: true
            },
        ]

        In all cases type === 'text'.
        All cases must have a 'label'.
        All cases must have a boolean property 'enabled' which determines whether
            the checkbox is checked.
        If defining a simple property query then you just need to specify
            the 'field'
        If defining a nested property query then you also need to specify
            the 'path'.
*/
// import { matchQuery, matchPhraseQuery, execute } from "./search-builder";

import { Query, BoolQuery } from "@coedl/elastic-query-builder";
import { matchQuery, matchPhraseQuery } from "@coedl/elastic-query-builder/queries";
import { execute } from "components/shared/search-builder";

export default {
    props: {
        autofocus: {
            type: Boolean,
            default: true,
        },
        fields: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            text: "",
            phrase: true,
            operator: "AND",
            fieldDataVerifies: true,
        };
    },
    async mounted() {
        // this.verifyFields();
        // if (this.autofocus) this.$refs.autocomplete.$refs.input.focus();
    },
    methods: {
        verifyFields() {
            // this.fieldDataVerifies = this.ss.verifyFields({
            //     fields: this.fields,
            //     ensure: [{ type: "text" }]
            // });
        },
        async querySearch(queryString, cb) {
            if (queryString.length < 3) return cb([]);

            let fields = this.fields.filter((f) => f.enabled);

            let clauses;
            if (this.phrase) {
                clauses = fields.map((f) =>
                    matchPhraseQuery({ field: f.field, value: queryString })
                );
            } else {
                clauses = fields.map((f) =>
                    matchQuery({
                        field: f.field,
                        value: queryString,
                        operator: this.operator,
                    })
                );
            }

            let query = new Query({});
            query.append(
                new BoolQuery()
                    .must(
                        new BoolQuery().should([
                            matchQuery({
                                field: "@type.keyword",
                                value: "RepositoryObject",
                            }),
                            matchQuery({
                                field: "@type.keyword",
                                value: "RepositoryCollection",
                            }),
                        ])
                    )
                    .filter(new BoolQuery().should(clauses))
            );
            // console.log(JSON.stringify(query.toJSON(), null, 2));

            let results = await execute({
                service: this.$store.state.configuration.service.search,
                index: this.$store.state.configuration.domain,
                query: query.toJSON(),
            });
            results = results.documents.map((r) => ({
                name: r._source.name,
                resource: r._source.resource,
                description: r._source.description,
                type: r._source["@type"],
            }));

            cb(results);
        },
        handleSelect(result) {
            let id = this.$store.state.configuration.domain
                ? result.resource.replace(`/${this.$store.state.configuration.domain}`, "")
                : result.resource;
            this.$router.push(`/view${id}`);
        },
    },
};
</script>

<style lang="scss">
.style-component .el-switch__label {
    @apply text-xs;
}
.style-component .el-switch__label.is-active {
    @apply text-yellow-700;
}
</style>
