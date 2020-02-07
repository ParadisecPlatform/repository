<template>
    <div>
        <license-component :data="data" />
        <data-display-component :data="data" />

        <div class="flex flex-col">
            <div class="flex flex-row xl:px-8">
                <div class="flex flex-col w-3/4 px-2">
                    <div class="my-4 text-3xl">
                        {{ data.objectifiedCrate.name }}
                    </div>
                    <div>collection: {{ collectionIdentifier }}</div>
                    <div class="h-2"></div>
                    <div>
                        Contributors:
                        <ul class="px-6">
                            <li
                                class="list-disc"
                                v-for="(contributor, idx) of data
                                    .objectifiedCrate.contributor"
                                :key="idx"
                            >
                                {{ contributor.contributor.name }} ({{
                                    contributor.name
                                }})
                            </li>
                        </ul>
                    </div>
                    <div class="h-2"></div>
                    <div class="my-4 px-6 text-xl">
                        <render-description-component
                            :description="data.objectifiedCrate.description"
                        />
                    </div>
                    <render-collection-information-component :data="data" />
                    <div class="flex flex-row flex-wrap">
                        <div
                            v-for="(item, idx) of data.objectifiedCrate
                                .hasMember"
                            :key="idx"
                        >
                            <el-tag
                                type="warning"
                                effect="dark"
                                class="mx-1 my-1"
                            >
                                <router-link :to="itemLink(item)">{{
                                    itemLabel(item)
                                }}</router-link>
                            </el-tag>
                        </div>
                    </div>
                </div>
                <div class="hidden lg:block">
                    <render-location-component
                        :top-left="
                            JSON.parse(
                                `[${
                                    data.objectifiedCrate.contentLocation.geo.box.split(
                                        ' '
                                    )[0]
                                }]`
                            )
                        "
                        :bottom-right="
                            JSON.parse(
                                `[${
                                    data.objectifiedCrate.contentLocation.geo.box.split(
                                        ' '
                                    )[1]
                                }]`
                            )
                        "
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import RenderLocationComponent from "components/shared/RenderLocation.component.vue";
import RenderCollectionInformationComponent from "./RenderCollectionInformation.component.vue";
import RenderDescriptionComponent from "components/shared/RenderDescription.component.vue";
import DataDisplayComponent from "components/shared/DataDisplay.component.vue";
import LicenseComponent from "./License.component.vue";
import { id } from "date-fns/locale";

export default {
    components: {
        RenderLocationComponent,
        RenderCollectionInformationComponent,
        RenderDescriptionComponent,
        DataDisplayComponent,
        LicenseComponent
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            collectionIdentifier: this.data.objectifiedCrate.identifier.filter(
                i => i.name === "collectionIdentifier"
            )[0].value
        };
    },
    methods: {
        itemLabel(item) {
            let link = this.$store.state.configuration.domain
                ? item["@id"].replace(
                      `/${this.$store.state.configuration.domain}/${this.collectionIdentifier}/`,
                      ""
                  )
                : item["@id"];
            return link;
        },
        itemLink(item) {
            let link = this.$store.state.configuration.domain
                ? item["@id"].replace(
                      `/${this.$store.state.configuration.domain}/`,
                      ""
                  )
                : item["@id"];
            return link;
        }
    }
};
</script>

<style lang="scss" scoped></style>