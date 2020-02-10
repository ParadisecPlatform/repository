<template>
    <div>
        <div class="flex flex-col">
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
                            <span class="style-collection-result" v-if="item.type === 'collection'">
                                <i class="far fa-clone"></i>
                                {{ item.name }}
                            </span>
                            <span class="style-item-result" v-if="item.type === 'item'">
                                <i class="fas fa-chevron-right"></i>
                                {{ item.name }}
                            </span>
                            <span class="text-gray-500">&nbsp;&nbsp;&nbsp;&nbsp;{{ item.id }}</span>
                        </template>
                    </el-autocomplete>

                    <div class="flex flex-row flex-wrap mt-2">
                        <el-checkbox
                            class="my-0 mx-2"
                            v-for="(field, idx) of fields"
                            :key="idx"
                            v-model="field.enabled"
                        >{{ field.label }}</el-checkbox>
                    </div>
                    <div class="text-xs mt-2 text-black">
                        Simple wildcard searches are supported. Try adding '*'
                        to match zero or more characters or '?' to match a
                        single character.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { SearchService } from "../search.service";

export default {
    props: {
        autofocus: {
            type: Boolean
        }
    },
    data() {
        return {
            text: "",
            fields: [
                { label: "Name", field: "name", enabled: true },
                { label: "Description", field: "description", enabled: true },
                { label: "Contributor", field: "contributor", enabled: true },
                {
                    label: "Subject Language",
                    field: "subjectLanguages",
                    enabled: false
                },
                {
                    label: "Content Language",
                    field: "contentLanguages",
                    enabled: false
                }
            ],
            form: {},
            results: {
                documents: [],
                total: 0
            }
        };
    },
    async mounted() {
        this.searchService = new SearchService({ store: this.$store });
        if (this.autofocus) this.$refs.autocomplete.$refs.input.focus();
    },
    methods: {
        async querySearch(queryString, cb) {
            let fields = this.fields.filter(f => f.enabled);
            fields = fields.map(f => f.field);

            if (queryString.length < 3) return cb([]);
            const results = await this.searchService.textSearch({
                text: queryString,
                fields
            });
            cb(results.documents);
        },
        handleSelect(result) {
            this.$router.push({ path: result.id });
        }
    }
};
</script>

<style lang="scss" scoped></style>
