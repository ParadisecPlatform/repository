<template>
    <div class="flex flex-row p-4 text-sm">
        <!-- must match -->
        <div class="w-30 m-2 pr-2 border-r border-black">{{label}} match</div>
        <div class="flex flex-col flex-grow p-1">
            <div v-for="(entry,idx) of clause" :key="entry.id">
                <div class="flex flew-row my-1">
                    <div class="flex-grow">
                        <field-selector-component @selected-field="addFieldData" :id="entry.id" />
                    </div>
                    <div>
                        <el-button @click="removeClause({ id: entry.id })" size="small">
                            <i class="fas fa-trash-alt"></i>
                        </el-button>
                    </div>
                    <div class="w-2 text-right leading-loose">
                        <span v-if="idx !== clause.length-1">&nbsp;&&nbsp;</span>
                    </div>
                </div>
            </div>
            <div>
                <el-button @click="addClause" size="small">
                    <i class="fas fa-plus"></i>
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { SearchService } from "../search.service";
import FieldSelectorComponent from "./FieldSelector.component.vue";
import { uniqBy, compact } from "lodash";

export default {
    components: {
        FieldSelectorComponent
    },
    props: {
        type: {
            type: String,
            required: true,
            validator: val => ["must", "mustNot", "should"].includes(val)
        },
        label: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            clause: []
        };
    },
    mounted() {
        this.ss = new SearchService({ store: this.$store });
    },
    methods: {
        addClause() {
            this.clause.push({ id: Math.random() });
        },
        removeClause({ id }) {
            this.clause = this.clause.filter(e => e.id !== id);
            this.emitData();
        },
        addFieldData(data) {
            this.clause = this.clause.map(e => {
                if (e.id === data.id)
                    return {
                        ...e,
                        ...data
                    };
                return e;
            });
            this.emitData();
        },
        emitData() {
            let filters = this.clause.map(e => {
                try {
                    return this.ss.queryBuilder(e);
                } catch (error) {
                    // ignore errors - usually arises from missing data
                }
            });
            this.$emit("update", { type: this.type, filters });
        }
    }
};
</script>

<style lang="scss" scoped></style>
