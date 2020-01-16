<template>
    <div class="hidden lg:block flex flex-col">
        <div>
            <div class="flex flex-row flex-wrap my-4">
                <el-button
                    @click="toggle(idx)"
                    size="mini"
                    v-for="(control, idx) of controls"
                    :key="idx"
                >
                    <span v-if="!show[idx]">Show</span>
                    <span v-else>Hide</span>
                    {{control.name}}
                </el-button>
            </div>
        </div>
        <div class="style-data-view bg-white p-8 mx-6 overflow-scroll my-4" v-if="showing">
            <pre class="text-sm">{{showing}}</pre>
        </div>
    </div>
</template>

<script>
import { range } from "lodash";

export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            controls: [
                { name: "OCFL inventory file", data: this.data.inventory },
                { name: "RO-Crate", data: this.data.flattenedCrate },
                { name: "Objectified Crate", data: this.data.objectifiedCrate },
                { name: "Data files", data: this.data.datafiles }
            ],
            show: range(4).map(r => false),
            showing: undefined
        };
    },
    methods: {
        toggle(item) {
            this.show = this.show.map((s, idx) => {
                return item === idx && !s ? true : false;
            });
            this.showing = this.show.includes(true)
                ? this.controls[this.show.indexOf(true)].data
                : undefined;
        }
    }
};
</script>

<style lang="scss" scoped>
.style-data-view {
    height: 500px;
}
</style>