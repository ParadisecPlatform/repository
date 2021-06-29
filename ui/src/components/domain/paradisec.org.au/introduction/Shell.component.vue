<template>
    <div>
        <div class="flex flex-col lg:flex-row">
            <div class="flex flex-col w-full lg:w-2/4 mr-1">
                <div class="flex-grow flex flex-col items-center">
                    <a href="https://www.paradisec.org.au/" target="blank" class="block">
                        <el-image src="assets/images/pdsc-logo.png" fit="contain" class="h-12" />
                    </a>
                </div>
                <div class="text-center text-xl lg:my-6">
                    Welcome to the catalog of the
                    <span class="font-bold">PARADISEC</span> collection.
                </div>
                <div class="bg-yellow-200 p-4 rounded-full">
                    <introduction-stats-component />
                </div>
                <div
                    class="border border-gray-200 rounded text-justify my-2 lg:my-4 p-4 flex flex-col space-y-2"
                >
                    <div>
                        PARADISEC (Pacific And Regional Archive for DIgital Sources in Endangered
                        Cultures) curates digital material about small or endangered languages. The
                        catalog entry for an item is usually written by the depositor, and some are
                        more detailed than others.
                    </div>
                    <div>
                        In the case of collections that we have digitised from deceased researchers,
                        we do the best we can to describe the records, but often there is little
                        information available. By placing these items in the collection we hope that
                        other researchers will enrich the descriptions as they use the material. We
                        believe the rights in the material presented in this collection have been
                        cleared by the depositors. Please let us know if you think that is not the
                        case for any particular item.
                    </div>
                    <div>
                        PARADISEC has been developed since 2003 by a consortium of Australian
                        researchers from the University of Sydney, the University of Melbourne and
                        the Australian National University.
                    </div>
                    <div class="text-center">
                        See the
                        <a href="https://www.paradisec.org.au" target="_blank">PARADISEC</a>
                        website for further details.
                    </div>
                </div>
            </div>
            <div class="flex flex-col w-full lg:w-2/4 lg:ml-1">
                <div class="my-1 bg-gray-400 rounded">
                    <item-jumper-component />
                </div>
                <div class="my-1 bg-gray-300 rounded p-4">
                    <div class="text-sm">Simple Search</div>
                    <simple-search-component :fields="fields" :autofocus="false" class="mt-2" />
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
import SimpleSearchComponent from "components/shared/SimpleSearch.component.vue";
import IntroductionStatsComponent from "./IntroductionStats.component.vue";
import RecentlyUpdatedComponent from "./RecentlyUpdated.component.vue";

export default {
    components: {
        ItemJumperComponent,
        ItemBrowserComponent,
        SimpleSearchComponent,
        IntroductionStatsComponent,
        RecentlyUpdatedComponent,
    },
    data() {
        return {
            paradisec: {},
            fields: [
                { type: "text", label: "Name", field: "name", enabled: true },
                {
                    type: "text",
                    label: "Description",
                    field: "description",
                    enabled: true,
                },
                {
                    type: "text",
                    label: "Contributor",
                    field: "contributor.name",
                    enabled: true,
                },
                {
                    type: "text",
                    label: "Subject Language",
                    field: "subjectLanguages.name",
                    enabled: false,
                },
                {
                    type: "text",
                    label: "Content Language",
                    field: "contentLanguages.name",
                    enabled: false,
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped></style>
