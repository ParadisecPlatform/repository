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
                            <span
                                class="style-collection-result"
                                v-if="item.type === 'collection'"
                            >
                                <i class="far fa-clone"></i>
                                {{ item.name }}
                            </span>
                            <span
                                class="style-item-result"
                                v-if="item.type === 'item'"
                            >
                                <i class="fas fa-chevron-right"></i>
                                {{ item.name }}
                            </span>
                            <span class="text-gray-500"
                                >&nbsp;&nbsp;&nbsp;&nbsp;{{ item.id }}</span
                            >
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
                                v-model="phraseSearch"
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
                                v-show="!phraseSearch"
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
                    <div class="text-xs mt-2 text-black">
                        Simple wildcard searches are supported. Try adding '*'
                        to match zero or more characters or '?' to match a
                        single character.
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
import { SearchService } from "./search.service";

export default {
    props: {
        autofocus: {
            type: Boolean,
            default: true
        },
        fields: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            text: "",
            phraseSearch: true,
            operator: "AND",
            fieldDataVerifies: true
        };
    },
    async mounted() {
        this.ss = new SearchService({ store: this.$store });
        this.verifyFields();
        if (this.autofocus) this.$refs.autocomplete.$refs.input.focus();
    },
    methods: {
        verifyFields() {
            this.fieldDataVerifies = this.ss.verifyFields({
                fields: this.fields,
                ensure: [{ type: "text" }]
            });
        },
        async querySearch(queryString, cb) {
            let fields = this.fields.filter(f => f.enabled);
            fields.forEach(f => (f.value = queryString));

            if (queryString.length < 3) return cb([]);
            const results = await this.ss.textSearch({
                fields,
                operator: this.operator,
                phraseSearch: this.phraseSearch
            });
            cb(results.documents);
        },
        handleSelect(result) {
            this.$router.push({ path: result.id });
        }
    }
};
</script>

<style lang="scss">
.style-component .el-switch__label {
    @apply text-xs;
}
.style-component .el-switch__label.is-active {
    @apply text-yellow-500;
}
</style>
