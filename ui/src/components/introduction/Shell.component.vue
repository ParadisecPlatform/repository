<template>
    <div>
        <div class="flex flex-col">
            <div class="flex-grow flex flex-col items-center">
                <a :href="data.projectUrl" target="blank" class="block">
                    <el-image :src="data.logo" fit="contain" class="h-12" />
                </a>
            </div>
            <div class="text-center text-2xl lg:my-6">
                {{ data.welcome }}
            </div>
            <div
                class="border border-gray-200 rounded text-justify my-2 lg:my-4 p-4 flex flex-col space-y-2"
            >
                <div class="flex flex-col space-y-4 text-center">
                    <div v-for="(entry, idx) of data.about" :key="idx">{{ entry }}</div>
                    <div>
                        See the
                        <a :href="data.projectUrl" target="_blank">{{ data.name }} website</a>
                        for more information.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useStore } from "vuex";
const $store = useStore();

const data = reactive({ ...$store.state.configuration.ui.introduction });

// import ItemBrowserComponent from "./ItemBrowser.component.vue";
// import SimpleSearchComponent from "components/shared/SimpleSearch.component.vue";
// import IntroductionStatsComponent from "./IntroductionStats.component.vue";
// import RecentlyUpdatedComponent from "./RecentlyUpdated.component.vue";

// export default {
//     components: {
//         ItemJumperComponent,
//         ItemBrowserComponent,
//         SimpleSearchComponent,
//         IntroductionStatsComponent,
//         RecentlyUpdatedComponent,
//     },
//     data() {
//         return {
//             paradisec: {},
//             fields: [
//                 { type: "text", label: "Name", field: "name", enabled: true },
//                 {
//                     type: "text",
//                     label: "Description",
//                     field: "description",
//                     enabled: true,
//                 },
//                 {
//                     type: "text",
//                     label: "Contributor",
//                     field: "contributor.name",
//                     enabled: true,
//                 },
//                 {
//                     type: "text",
//                     label: "Subject Language",
//                     field: "subjectLanguages.name",
//                     enabled: false,
//                 },
//                 {
//                     type: "text",
//                     label: "Content Language",
//                     field: "contentLanguages.name",
//                     enabled: false,
//                 },
//             ],
//         };
//     },
// };
</script>

<style lang="scss" scoped></style>
