<template>
    <div>
        <data-display-component :data="data" />

        <div class="flex flex-col">
            <div class="flex flex-row xl:px-8">
                <div class="w-3/4">
                    <div class="my-4 text-3xl">
                        {{ data.objectifiedCrate.name }}
                    </div>
                    <div>
                        Item: {{ collectionIdentifier }} / {{ itemIdentifier }}
                    </div>
                    <div>
                        Collection:
                        <router-link :to="collectionLink()">{{
                            collectionIdentifier
                        }}</router-link>
                    </div>
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
                    <div class="my-4 px-6 text-xl">
                        <render-description-component
                            :description="data.objectifiedCrate.description"
                        />
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
            <div class="my-4">
                <render-item-information-component :data="data" />
            </div>
            <div class="mt-4">
                <render-content-component :data="data" />
            </div>
        </div>
    </div>
</template>

<script>
import RenderContentComponent from "./RenderContent.component.vue";
import RenderItemInformationComponent from "./RenderItemInformation.component.vue";
import RenderLocationComponent from "src/components/shared/RenderLocation.component.vue";
import RenderDescriptionComponent from "src/components/shared/RenderDescription.component.vue";
import DataDisplayComponent from "src/components/shared/DataDisplay.component.vue";

export default {
    components: {
        RenderContentComponent,
        RenderItemInformationComponent,
        RenderDescriptionComponent,
        RenderLocationComponent,
        DataDisplayComponent
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
            )[0].value,
            itemIdentifier: this.data.objectifiedCrate.identifier.filter(
                i => i.name === "itemIdentifier"
            )[0].value
        };
    },
    methods: {
        collectionLink() {
            return this.$store.state.configuration.domain
                ? `/view/${this.collectionIdentifier}`
                : item.rocrate.memberOf["@id"];
        }
    }
};
</script>

<style lang="scss" scoped></style>
