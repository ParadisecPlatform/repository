<template>
    <div>
        <div class="flex flex-col">
            <div :class="itemStyle">
                <pre v-if="debug">{{ item }}</pre>
                <div v-for="(row, idx) of renderInformation(item)" :key="idx" class="flex flex-row">
                    <div class="w-64">{{ row.name }}</div>
                    <div class="flex-grow">{{ row.data.join(" ") }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/*

    Example: 

    <render-item-by-id-component
        :crate="data.rocrate"
        id="http://nla.gov.au/nla.party-479603"
        :layout="[{ name: 'Name', fields: ['givenName', 'familyName'] }]"
        item-style="bg-yellow-200 p-4 rounded my-1"
    />
*/

import { ROCrate } from "ro-crate";
import { isArray, isString, isPlainObject } from "lodash";

export default {
    props: {
        // render the data objects to the screen
        debug: {
            type: Boolean,
            required: false,
            default: false,
        },
        // the crate from which to extract the data
        crate: {
            type: Object,
            required: true,
        },
        // th entity type to extract
        id: {
            type: String,
            required: true,
        },
        // the data to display
        //   must be an array of arrays with property names
        //   :layout="[
        //     [ 'givenName', 'lastName', 'role.name' ]
        //   ]"
        // can traverse subgraphs and extract data by using dot names - e.g. role.name
        //   extract the name property from every element referenced in the role property
        layout: {
            type: Array,
            required: true,
            default: () => [],
        },
        // css classes to apply to each item
        itemStyle: {
            type: String,
        },
        // resolve subgraphs
        //  pass in a property that points to other elements
        //   :resolve="['role', 'homeLocation']"
        resolve: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    data() {
        return {
            item: this.loadItem(),
        };
    },
    methods: {
        loadItem() {
            const crate = new ROCrate(this.crate);
            crate.index();
            let item = crate.getItem(this.id);
            if (this.layout.length) {
                if (this.resolve.length) {
                    this.resolve.forEach((property) => {
                        item[property] = crate.resolve([item], [{ property }]);
                    });
                }
            }
            return item;
        },
        renderInformation(item) {
            let info = [];
            for (let row of this.layout) {
                let data = [];
                for (let property of row.fields) {
                    data.push(this.get(item, property));
                }
                info.push({ name: row.name, data });
            }
            return info;
        },
        get(item, property) {
            if (property.match(/\./)) {
                let properties = property.split(".");
                return this.get(item[properties.shift()], properties.join(".")).join(", ");
            } else {
                if (isArray(item)) {
                    return item.map((i) => this.get(i, property));
                } else {
                    return item[property];
                }
            }
        },
    },
};
</script>
