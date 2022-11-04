<template>
    <div>
        <div class="flex flex-col">
            <div v-for="(item, idx) of items" :key="idx">
                <render-item-by-id-component
                    :crate="crate"
                    :id="item['@id']"
                    :layout="layout"
                    :item-style="itemStyle"
                />
            </div>
        </div>
    </div>
</template>

<script>
/*
    Example:

    <render-items-of-type-component
        :crate="data.rocrate"
        type="Person"
        :layout="[
            { name: '@type', fields: ['@type'] },
            { name: 'ID', fields: ['@id'] },
            { name: 'Name', fields: ['givenName', 'familyName'] },
            { name: 'Role', fields: ['role.name'] },
            { name: 'Country', fields: ['homeLocation.name'] },
        ]"
        :resolve="['role', 'homeLocation']"
        item-style="bg-blue-200 p-4 rounded my-1"
    />
*/
import RenderItemByIdComponent from "./RenderItemById.component.vue";
// import { ROCrate } from "ro-crate";
import { isArray } from "lodash";

export default {
    components: {
        RenderItemByIdComponent,
    },
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
        type: {
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
            required: false,
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
            items: this.loadItems(),
        };
    },
    methods: {
        loadItems() {
            // const crate = new ROCrate(this.crate);
            // crate.index();
            // let items = crate._item_by_type[this.type].map((i) => {
            //     this.resolve.forEach((property) => {
            //         i[property] = crate.resolve([i], [{ property }]);
            //     });
            //     return i;
            // });
            // return items;
        },
    },
};
</script>
