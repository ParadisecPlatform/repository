<template>
    <div>
        <div class="flex justify-center">
            <div class="text-3xl style-heading">OCFL Catalog Viewer</div>
        </div>
        <div class="flex flex-col mt-5">
            <p>
                This application is a Proof of Concept demonstrating a single page application operating
                over an OCFL on-disk repository with search capability provided via Elastic Search. Read
                <router-link to="/about">the about page</router-link>&nbsp;to find out more.
            </p>
            <introduction-stats-component class="hidden md:block" />
        </div>
        <div class="mt-4 inline">
            Search the catalog via
            <router-link to="/explore" class="inline">explore</router-link>.
        </div>
        <div class="my-4 flex flex-col justify-center">
            <div>Or navigate directly to a collection:</div>
            <div class="flex flex-row flex-wrap justify-center">
                <el-tag v-for="(collection, idx) of collections" :key="idx" class="m-2">
                    <router-link :to="route(collection)">/paradisec.org.au/{{collection}}</router-link>
                </el-tag>
            </div>
            <div class="mt-4">Or an item:</div>
            <div class="flex flex-row flex-wrap justify-center">
                <el-tag v-for="(item , idx) of items" :key="idx" class="m-2">
                    <router-link :to="route(item)">/paradisec.org.au/{{item}}</router-link>
                </el-tag>
            </div>
        </div>
        <div class="m-4 text-center">
            <strong>
                Note that only the items listed above have content loaded.
                <br />For all other items only the metadata
                is available in this demonstrator.
            </strong>
        </div>
    </div>
</template>

<script>
import IntroductionStatsComponent from "./IntroductionStats.component.vue";

export default {
    components: {
        IntroductionStatsComponent
    },
    data() {
        return {
            collections: ["AC1", "NT1", "NT5"],
            items: [
                "AC1/001",
                "AC1/002",
                "NT1/98007",
                "NT1/2004",
                "NT1/20003",
                "NT3/nafakoron",
                "NT3/sesake",
                "NT5/TokelauOf",
                "NT6/2005V001",
                "PAMBU/DOC1014",
                "SN1/MM20130708Museum",
                "WDVA1/MIR_07",
                "WDVA1/TJILK05"
            ]
        };
    },
    computed: {
        status: function() {
            return this.$store.state.status;
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    methods: {
        route(collection) {
            return `/paradisec.org.au/${collection}`;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "assets/variables.scss";

.style-heading {
    color: $brand-primary-color;
}
</style>