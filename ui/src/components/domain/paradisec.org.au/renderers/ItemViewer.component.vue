<template>
    <div>
        <div class="flex flex-col" id="content" v-if="item && item.name">
            <div class="flex flex-col space-y-2">
                <div class="my-4 text-3xl">{{ item.name }}</div>
                <div class="mb-2">
                    <license-component :data="item.license[0]" />
                </div>
                <div class="flex flex-row space-x-2">
                    <div class="flex flex-col space-y-2 flex-grow">
                        <div class="text-sm">
                            Item Identifier {{ item.collectionIdentifier }} /
                            {{ item.itemIdentifier }}
                        </div>
                        <div class="text-sm">
                            Collection
                            <router-link :to="collectionLink(item.collectionIdentifier)">
                                {{ item.collectionIdentifier }}
                            </router-link>
                        </div>

                        <div class="p-6 rounded">
                            {{ item.description }}
                        </div>

                        <render-set-component
                            name="Contributors"
                            :items="item.contributor"
                            :fields="['displayName']"
                            layout="{displayName}"
                        />

                        <render-set-component
                            name="Publisher"
                            :items="item.publisher"
                            :fields="['name']"
                            layout="{name}"
                        />

                        <render-set-component name="Countries" :items="item.countries" />

                        <render-set-component
                            name="Fields of Research"
                            :items="item.fieldsOfResearch"
                            :fields="['name', 'identifier']"
                            layout="{name} ({identifier})"
                        />
                    </div>
                    <div>
                        <render-location-component
                            :content-location="item.contentLocation"
                            width="200"
                            height="200"
                            class="p-4 border border-gray-600"
                        />
                    </div>
                </div>

                <render-item-information-component :item="item" />

                <render-set-component
                    name="Subject Languages"
                    :items="item.subjectLanguages"
                    item-style="bg-yellow-400"
                />

                <render-set-component
                    name="Content Languages"
                    :items="item.contentLanguages"
                    item-style="bg-yellow-400"
                />
                <render-content-component :data="data" />
            </div>
        </div>
    </div>
</template>

<script>
import RenderLocationComponent from "./RenderLocation.component.vue";
import RenderContentComponent from "./RenderContent.component.vue";
import RenderItemInformationComponent from "./RenderItemInformation.component.vue";
import LicenseComponent from "./License.component.vue";
import RenderSetComponent from "../../../shared/RenderSet.component.vue";
import { ROCrate } from "ro-crate";
import { flattenDeep } from "lodash";

export default {
    components: {
        RenderContentComponent,
        RenderItemInformationComponent,
        LicenseComponent,
        RenderSetComponent,
        RenderLocationComponent,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            item: {},
        };
    },
    mounted() {
        this.loadItem();
    },
    methods: {
        loadItem() {
            const crate = new ROCrate(this.data.rocrate);
            crate.index();
            let item = crate.getRootDataset();
            item = this.populate(crate, item, [
                "contentLocation",
                "contributor",
                "identifier",
                "license",
                "publisher",
                "countries",
                "contentLanguages",
                "subjectLanguages",
            ]);
            item.collectionIdentifier = item.identifier.filter(
                (i) => i.name === "collectionIdentifier"
            )[0].value;
            item.itemIdentifier = item.identifier.filter(
                (i) => i.name === "itemIdentifier"
            )[0].value;
            item.contributor = item.contributor.map((contributor) => {
                contributor.role = flattenDeep([contributor.role]);
                contributor.role = contributor.role.map((role) => crate.getItem(role["@id"]));

                contributor.homeLocation = flattenDeep([contributor.homeLocation]);
                contributor.homeLocation = contributor.homeLocation.map((location) =>
                    crate.getItem(location["@id"])
                );
                contributor.displayName = `${contributor.givenName} ${
                    contributor.familyName
                } - ${contributor.role.map((r) => r.name).join(", ")}`;
                return contributor;
            });
            item.contentLocation = item.contentLocation.map((l) => {
                if (l.geo) l.geo = crate.getItem(l.geo["@id"]);
                return l;
            });
            item.hasPart = flattenDeep([item.hasPart]);

            // console.log(JSON.stringify(item, null, 2));
            this.item = item;
        },
        populate(crate, item, properties) {
            for (let property of properties) {
                item[property] = flattenDeep([item[property]]).map((linkedItem) =>
                    crate.getItem(linkedItem["@id"])
                );
            }
            return item;
        },
        collectionLink(collectionIdentifier) {
            return this.$store.state.configuration.domain
                ? `/view/${collectionIdentifier}`
                : item.memberOf["@id"];
        },
    },
};
</script>

<style lang="scss" scoped></style>
