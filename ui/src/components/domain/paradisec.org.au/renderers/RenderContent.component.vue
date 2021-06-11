<template>
    <div class="flex flex-col">
        <conditions-of-access-component
            v-if="showConditionsOfAccess"
            @accept-conditions="acceptConditions"
            class="p-8 bg-yellow-200 text-gray-700"
        />

        <div class="bg-green-200 p-8 text-center" v-if="!showConditionsOfAccess">
            You have agreed to the conditions of access for viewing the content of this item. To
            review the conditions
            <a class="cursor-pointer text-yellow-600" href.prevent="" @click="reviewConditions"
                >click here.</a
            >
        </div>

        <media-player-component :data="data" v-if="!showConditionsOfAccess" />
    </div>
</template>

<script>
import ConditionsOfAccessComponent from "./ConditionsOfAccess.component.vue";
import MediaPlayerComponent from "components/shared/media-player/Shell.component.vue";
import { ROCrate } from "ro-crate";

export default {
    components: {
        ConditionsOfAccessComponent,
        MediaPlayerComponent,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            activeTab: undefined,
            showConditionsOfAccess: true,
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let identifier = this.getIdentifier();
            let agreements = JSON.parse(window.localStorage.getItem("paradisecAgreements"));
            if (agreements && agreements[identifier]) {
                this.showConditionsOfAccess = false;
            }
        },
        acceptConditions() {
            let identifier = this.getIdentifier();
            let agreements = JSON.parse(window.localStorage.getItem("paradisecAgreements"));
            if (!agreements) agreements = {};
            agreements[identifier] = true;
            window.localStorage.setItem("paradisecAgreements", JSON.stringify(agreements));
            this.showConditionsOfAccess = false;
        },
        reviewConditions() {
            let identifier = this.getIdentifier();
            let agreements = JSON.parse(window.localStorage.getItem("paradisecAgreements"));
            delete agreements[identifier];
            window.localStorage.setItem("paradisecAgreements", JSON.stringify(agreements));
            this.showConditionsOfAccess = true;
        },
        getIdentifier() {
            const crate = new ROCrate(this.data.rocrate);
            crate.index();
            let identifier = crate.resolve([crate.getRootDataset()], [{ property: "identifier" }]);
            let collectionIdentifier = identifier.filter(
                (i) => i.name === "collectionIdentifier"
            )[0].value;
            let itemIdentifier = identifier.filter((i) => i.name === "itemIdentifier")[0].value;
            return `${collectionIdentifier}/${itemIdentifier}`;
        },
    },
};
</script>

<style lang="scss" scoped></style>
