<template>
    <div class="flex flex-col">
        <conditions-of-access-component
            v-if="data.showConditionsOfAccess"
            @accept-conditions="acceptConditions"
            class="p-8 bg-yellow-200 text-gray-700"
        />

        <div class="bg-green-200 p-2 text-center font-light" v-if="!data.showConditionsOfAccess">
            You have agreed to the conditions of access for viewing the content of this item. To
            review the conditions
            <a class="cursor-pointer text-blue-600" href.prevent="" @click="reviewConditions"
                >click here.</a
            >
        </div>

        <media-player-component :crate="this.crate" v-if="!data.showConditionsOfAccess" />
    </div>
</template>

<script setup>
import ConditionsOfAccessComponent from "./ConditionsOfAccess.component.vue";
import MediaPlayerComponent from "@/components/modules/media-player/Shell.component.vue";
// import { ROCrate } from "ro-crate";
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { intervalToDuration, parseISO } from "date-fns";
import { agreementsKey, putLocalStorage, getLocalStorage } from "../../storage.js";

const $store = useStore();
const $route = useRoute();

const configuration = $store.getters.getConfiguration;

const props = defineProps({
    crate: {
        type: Object,
        required: true,
    },
});
const data = reactive({
    activeTab: undefined,
    showConditionsOfAccess: true,
    identifier: getIdentifier(),
});
onMounted(() => {
    init();
});
function getIdentifier() {
    if (configuration.links === "paradisec") {
        return `${$route.params.collectionId}_${$route.params.itemId}`;
    } else {
        return $route.params.itemId;
    }
}
function init() {
    let agreements = getLocalStorage({ key: agreementsKey });
    if (agreements && agreements[data.identifier]) {
        const interval = intervalToDuration({
            start: parseISO(agreements[data.identifier]),
            end: new Date(),
        });
        if (interval.years === 0 && interval.months === 0) {
            data.showConditionsOfAccess = false;
        } else {
            reviewConditions();
        }
    }
}

function acceptConditions() {
    let agreements = getLocalStorage({ key: agreementsKey });
    if (!agreements) agreements = {};
    agreements[data.identifier] = new Date().toISOString();
    putLocalStorage({ key: agreementsKey, data: agreements });
    data.showConditionsOfAccess = false;
}
function reviewConditions() {
    let agreements = getLocalStorage({ key: agreementsKey });
    delete agreements[data.identifier];
    putLocalStorage({ key: agreementsKey, data: agreements });
    data.showConditionsOfAccess = true;
}
</script>
