<template>
    <div>
        <div class="flex flex-col lg:flex-row">
            <div class="flex flex-col w-full lg:w-2/4 mr-1">
                <div class="text-center text-xl my-3 lg:my-6">
                    Welcome to the catalog of the
                    <span class="font-bold">PARADISEC</span> collection.
                </div>
                <!-- <div class="bg-teal-200 p-4 mb-4 rounded-full">
                    <introduction-stats-component />
                </div>-->
                <el-card class="box-card text-sm text-justify bg-white">
                    <p>
                        PARADISEC has been developed since 2003 by a consortium
                        of Australian researchers from the University of Sydney,
                        the University of Melbourne and the Australian National
                        University.
                    </p>
                    <p class="text-center">
                        See the
                        <a href="www.paradisec.org.au" target="_blank">PARADISEC</a>
                        website for further details.
                    </p>
                </el-card>
                <el-card class="box-card text-sm text-justify my-2 lg:my-4">
                    PARADISEC (Pacific And Regional Archive for DIgital Sources
                    in Endangered Cultures) curates digital material about small
                    or endangered languages. The catalog entry for an item is
                    usually written by the depositor, and some are more detailed
                    than others. In the case of collections that we have
                    digitised from deceased researchers, we do the best we can
                    to describe the records, but often there is little
                    information available. By placing these items in the
                    collection we hope that other researchers will enrich the
                    descriptions as they use the material. We believe the rights
                    in the material presented in this collection have been
                    cleared by the depositors. Please let us know if you think
                    that is not the case for any particular item.
                </el-card>
                <el-card class="my-1 bg-orange-200 p-4 rounded">
                    <p class="text-sm">
                        This installation is a Proof of Concept demonstrating a
                        new generation catalog operating as a single page
                        application interacting with an OCFL on-disk repository.
                        Search capability is provided provided via Elastic
                        Search. Read
                        <router-link to="/about">the about page</router-link>&nbsp;to find out more.
                    </p>
                </el-card>
            </div>
            <div class="flex flex-col w-full lg:w-2/4 lg:ml-1">
                <div class="my-1 bg-gray-500 rounded">
                    <item-jumper-component />
                </div>
                <div class="my-1 bg-gray-400 rounded p-4">
                    <div class="text-sm">Simple Search</div>
                    <simple-search-component :autofocus="false" class="mt-2" />
                </div>
                <div class="my-1 bg-gray-300 rounded">
                    <item-browser-component />
                </div>
            </div>
        </div>
        <div class="flex flex-row">
            <div class="p-4 text-center">
                <recently-updated-component />
            </div>
        </div>
    </div>
</template>

<script>
import ItemJumperComponent from "./ItemJumper.component.vue";
import ItemBrowserComponent from "./ItemBrowser.component.vue";
import SimpleSearchComponent from "../shared/SimpleSearch.component.vue";
import IntroductionStatsComponent from "./IntroductionStats.component.vue";
import RecentlyUpdatedComponent from "./RecentlyUpdated.component.vue";

export default {
    components: {
        ItemJumperComponent,
        ItemBrowserComponent,
        SimpleSearchComponent,
        IntroductionStatsComponent,
        RecentlyUpdatedComponent
    },
    data() {
        return {
            paradisec: {}
        };
    },
    computed: {}
};
</script>

<style lang="scss" scoped>
@import "assets/variables.scss";

.style-heading {
    color: $brand-primary-color;
}
</style>
