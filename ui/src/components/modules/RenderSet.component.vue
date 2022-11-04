<template>
    <div>
        <div v-if="itemData && itemData.length">
            <div class="text-sm">
                {{ name }}
                <el-button type="text" @click="toggleItemData" v-if="items.length > maxItemsToShow">
                    <span v-show="showAll">
                        <i class="fas fa-chevron-up"></i>
                    </span>
                    <span v-show="!showAll">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                </el-button>
            </div>
            <div class="flex flex-row flex-wrap">
                <div v-for="(item, idx) of itemData" :key="idx" :class="defaultStyle">
                    {{ renderItem(item) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/*
* Example Usage:
* 
    <render-set-component
        name="Fields of Research"
        :items="collection.fieldsOfResearch"
        :fields="['name', 'identifier']"
        layout="{name} ({identifier})"
    />
*
*
*/
import { compact, flattenDeep } from "lodash";
export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        items: {
            type: Array | Object,
            required: true,
        },
        fields: {
            type: Array,
            default: () => ["name", "code"],
        },
        layout: {
            type: String,
            default: "{name} ({code})",
        },
        itemStyle: {
            type: String,
        },
    },
    data() {
        return {
            showAll: false,
            maxItemsToShow: 10,
            defaultStyle: "m-1 p-2 rounded text-sm border",
        };
    },
    computed: {
        itemData: function() {
            let itemData = flattenDeep([this.items]);
            itemData = this.showAll ? [...itemData] : [...itemData.slice(0, this.maxItemsToShow)];
            return compact(itemData);
        },
    },
    mounted() {
        this.defaultStyle = this.itemStyle
            ? `${this.defaultStyle} ${this.itemStyle}`
            : `${this.defaultStyle} bg-blue-100 border-blue-400`;
    },
    methods: {
        toggleItemData() {
            this.showAll = !this.showAll;
        },
        renderItem(item) {
            let layout = this.layout;
            for (let field of this.fields) {
                let re = new RegExp(`{${field}}`);
                layout = layout.replace(re, item[field]);
            }
            return layout;
        },
    },
};
</script>

<style lang="scss" scoped></style>
