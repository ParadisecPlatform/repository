<template>
    <div>
        <div class="flex flex-col lg:flex-row">
            <div class="flex flex-col w-full lg:w-2/4 mr-1">
                <div class="text-center text-lg my-3 lg:my-6">
                    Welcome to the catalog of the
                    <span class="font-bold">PARADISEC</span> collection.
                </div>
                <div class="my-1 bg-gray-200 p-4 rounded">
                    <p>Who runs this site?</p>
                    <p class="text-sm">
                        PARADISEC has been developed since 2003 by a consortium of
                        Australian researchers from the University of Sydney,
                        the University of Melbourne and the Australian National University.
                        See the
                        <a
                            href="www.paradisec.org.au"
                            target="_blank"
                        >PARADISEC</a>
                        website for further details.
                    </p>
                </div>

                <div class="my-1 bg-orange-200 p-4 rounded">
                    <p class="text-sm">
                        This installation is a Proof of Concept demonstrating a new generation
                        catalog operating as a single
                        page application interacting with an OCFL on-disk repository.
                        Search capability is provided provided via Elastic Search. Read
                        <router-link to="/about">the about page</router-link>&nbsp;to
                        find out more.
                    </p>
                </div>
                <div class="my-1 bg-gray-400 rounded">
                    <item-jumper-component />
                </div>
                <div class="my-1 bg-gray-400 rounded">
                    <item-browser-component />
                </div>
            </div>
            <div class="flex flex-col w-full lg:w-2/4 ml-1">
                <div class="p-4 text-center">Recently Updated Content</div>
            </div>
        </div>
    </div>
</template>

<script>
import IntroductionStatsComponent from "./IntroductionStats.component.vue";
import ItemJumperComponent from "./ItemJumper.component.vue";
import ItemBrowserComponent from "./ItemBrowser.component.vue";

export default {
    components: {
        IntroductionStatsComponent,
        ItemJumperComponent,
        ItemBrowserComponent
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
