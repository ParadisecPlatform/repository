<template>
    <div class="hidden lg:block flex flex-col">
        <div class>
            <div class="flex flex-row flex-wrap my-4">
                <el-button @click="toggle('inventory')" size="mini">
                    <span v-if="!show.inventory">Show</span>
                    <span v-else>Hide</span>
                    OCFL inventory file
                </el-button>
                <el-button @click="toggle('crate')" size="mini">
                    <span v-if="!show.crate">Show</span>
                    <span v-else>Hide</span>
                    RO-Crate
                </el-button>
                <el-button @click="toggle('datafiles')" size="mini">
                    <span v-if="!show.datafiles">Show</span>
                    <span v-else>Hide</span>
                    data files
                </el-button>
            </div>
        </div>
        <div
            class="style-data-view bg-white p-8 mx-6 overflow-scroll my-4"
            v-if="show.inventory || show.crate || show.datafiles"
        >
            <div v-if="show.inventory">
                <pre class="text-sm">{{data.inventory}}</pre>
            </div>
            <div v-if="show.crate">
                <pre class="text-sm">{{data.flattenedCrate}}</pre>
            </div>
            <div v-if="show.datafiles">
                <pre class="text-sm">{{data.datafiles}}</pre>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            show: {
                inventory: false,
                crate: false,
                datafiles: false
            }
        };
    },
    methods: {
        toggle(item) {
            switch (item) {
                case "inventory":
                    this.show.inventory = !this.show.inventory;
                    this.show.crate = false;
                    this.show.datafiles = false;
                    break;
                case "crate":
                    this.show.crate = !this.show.crate;
                    this.show.inventory = false;
                    this.show.datafiles = false;
                    break;
                case "datafiles":
                    this.show.datafiles = !this.show.datafiles;
                    this.show.inventory = false;
                    this.show.crate = false;
                    break;
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.style-data-view {
    height: 500px;
}
</style>