<template>
    <div>
        <div class="flex flex-col" v-if="collection && collection.name">
            <div class="flex flex-col space-y-2">
                <div class="my-4 text-3xl">{{ collection.name }}</div>
                <div class="mb-2">
                    <license-component :data="collection.license[0]" />
                </div>

                <div class="flex flex-row space-x-2">
                    <div class="flex flex-col space-y-2 flex-grow">
                        <div class="text-sm">
                            Collection Identifier <em>{{ collection.collectionIdentifier }}</em>
                        </div>

                        <div class="p-6 rounded">
                            {{ collection.description }}
                        </div>

                        <render-set-component
                            name="Contributors"
                            :items="collection.contributor"
                            :fields="['displayName']"
                            layout="{displayName}"
                        />

                        <render-set-component
                            name="Publisher"
                            :items="collection.publisher"
                            :fields="['name']"
                            layout="{name}"
                        />

                        <render-set-component name="Countries" :items="collection.countries" />

                        <render-set-component
                            name="Fields of Research"
                            :items="collection.fieldsOfResearch"
                            :fields="['name', 'identifier']"
                            layout="{name} ({identifier})"
                        />
                    </div>
                    <div>
                        <render-location-component
                            :content-location="collection.contentLocation"
                            width="200"
                            height="200"
                            class="p-4 border border-gray-600"
                        />
                    </div>
                </div>

                <cite-as-component
                    type="Collection"
                    :id="collection.collectionIdentifier"
                    :contributors="collection.contributor"
                    :title="collection.name"
                    :doi="collection.doi"
                />

                <render-collection-information-component :collection="collection" />

                <render-set-component
                    name="Languages"
                    :items="collection.subjectLanguages"
                    item-style="bg-yellow-400"
                />

                <div class="text-sm">Items</div>
                <div class="flex flex-row flex-wrap">
                    <div v-for="(item, idx) of collection.hasMember" :key="idx">
                        <el-tag type="warning" effect="dark" class="mx-1 my-1">
                            <router-link :to="itemLink(item)">
                                {{ itemLabel(item) }}
                            </router-link>
                        </el-tag>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RenderLocationComponent from "./RenderLocation.component.vue";
import RenderCollectionInformationComponent from "./RenderCollectionInformation.component.vue";
import LicenseComponent from "./License.component.vue";
import RenderSetComponent from "../../../shared/RenderSet.component.vue";
import CiteAsComponent from "./CiteAs.component.vue";
import { ROCrate } from "ro-crate";
import { flattenDeep } from "lodash";

export default {
    components: {
        RenderLocationComponent,
        RenderCollectionInformationComponent,
        LicenseComponent,
        RenderSetComponent,
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
            crate: undefined,
            collection: {},
        };
    },
    mounted() {
        this.loadCollection();
    },
    methods: {
        loadCollection() {
            const crate = new ROCrate(this.data.rocrate);
            crate.index();
            let collection = crate.getRootDataset();
            console.log(JSON.stringify(collection, null, 2));
            collection = this.populate(crate, collection, [
                "contentLocation",
                "contributor",
                "identifier",
                "license",
                "publisher",
                "countries",
                "fieldsOfResearch",
                "subjectLanguages",
            ]);
            collection.collectionIdentifier = collection.identifier.filter(
                (i) => i.name === "collectionIdentifier"
            )[0].value;
            collection.contributor = collection.contributor.map((contributor) => {
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
            collection.contentLocation = collection.contentLocation.map((l) => {
                if (l.geo) l.geo = crate.getItem(l.geo["@id"]);
                return l;
            });
            collection.hasMember = flattenDeep([collection.hasMember]);
            collection.doi = collection.identifier.filter((i) => i.name === "doi")[0].value;

            // console.log(JSON.stringify(collection, null, 2));
            this.collection = collection;
        },
        itemLabel(item) {
            let link = this.$store.state.configuration.domain
                ? item["@id"].replace(
                      `/${this.$store.state.configuration.domain}/${this.collection.collectionIdentifier}/`,
                      ""
                  )
                : item["@id"];
            return link;
        },
        itemLink(item) {
            let link = this.$store.state.configuration.domain
                ? item["@id"].replace(`/${this.$store.state.configuration.domain}/`, "")
                : item["@id"];
            return link;
        },
        populate(crate, item, properties) {
            for (let property of properties) {
                item[property] = flattenDeep([item[property]]).map((linkedItem) =>
                    crate.getItem(linkedItem["@id"])
                );
            }
            return item;
        },
    },
};
</script>

<style lang="scss" scoped></style>
