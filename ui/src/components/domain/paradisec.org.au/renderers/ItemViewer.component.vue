<template>
    <div>
        <div class="flex flex-col" id="content" v-if="item && item.name">
            <el-tabs
                type="border-card"
                tab-position="top"
                v-model="activeTab"
                @tab-click="handleTabChange"
            >
                <el-tab-pane label="Metadata" name="metadata">
                    <div class="flex flex-col space-y-2">
                        <div class="my-4 text-3xl">{{ item.name }}</div>
                        <div class="mb-2">
                            <license-component :data="item.license[0]" />
                        </div>
                        <div class="flex flex-row space-x-2">
                            <div class="flex flex-col space-y-2 flex-grow">
                                <div class="text-sm">Item Identifier {{ item.itemIdentifier }}</div>
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

                        <cite-as-component
                            type="Item"
                            :id="item.itemIdentifier"
                            :contributors="item.contributor"
                            :originatedOn="item.originatedOn"
                            :title="item.name"
                            :doi="item.doi"
                        />

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
                    </div>
                </el-tab-pane>
                <el-tab-pane label="Content" name="content">
                    <render-content-component :data="data" v-if="activeTab === 'content'" />
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import RenderLocationComponent from "./RenderLocation.component.vue";
import RenderContentComponent from "./RenderContent.component.vue";
import RenderItemInformationComponent from "./RenderItemInformation.component.vue";
import LicenseComponent from "./License.component.vue";
import RenderSetComponent from "../../../shared/RenderSet.component.vue";
import CiteAsComponent from "./CiteAs.component.vue";
import { ROCrate } from "ro-crate";
import { flattenDeep } from "lodash";
import { populate, contributorDisplayName } from "./lib";

export default {
    components: {
        RenderContentComponent,
        RenderItemInformationComponent,
        LicenseComponent,
        RenderSetComponent,
        RenderLocationComponent,
        CiteAsComponent,
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
            activeTab: "metadata",
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
            item = populate(crate, item, [
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
            item.itemIdentifier = `${item.collectionIdentifier}/${
                item.identifier.filter((i) => i.name === "itemIdentifier")[0].value
            }`;
            item.contributor = item.contributor.map((contributor) => {
                contributor.role = flattenDeep([contributor.role]);
                contributor.role = contributor.role.map((role) => crate.getItem(role["@id"]));

                contributor.homeLocation = flattenDeep([contributor.homeLocation]);
                contributor.homeLocation = contributor.homeLocation.map((location) =>
                    crate.getItem(location["@id"])
                );
                contributor.displayName = contributorDisplayName(contributor);
                return contributor;
            });
            item.contentLocation = item.contentLocation.map((l) => {
                if (l.geo) l.geo = crate.getItem(l.geo["@id"]);
                return l;
            });
            item.hasPart = flattenDeep([item.hasPart]);
            item.doi = item.identifier.filter((i) => i.name === "doi")[0].value;

            // console.log(JSON.stringify(item, null, 2));
            this.item = item;
            this.setActiveTab();
        },
        collectionLink(collectionIdentifier) {
            return this.$store.state.configuration.domain
                ? `/view/${collectionIdentifier}`
                : item.memberOf["@id"];
        },
        setActiveTab() {
            if (this.$route.hash && this.$route.query?.type) {
                this.activeTab = "content";
            }
        },
        handleTabChange(tab) {
            if (tab._props.name === "metadata" && this.$route.hash) {
                this.$router.replace({
                    hash: "",
                    query: {
                        ocfl_version: this.$route.query.ocfl_version,
                    },
                });
            }
        },
    },
};
</script>

<style lang="scss" scoped></style>
