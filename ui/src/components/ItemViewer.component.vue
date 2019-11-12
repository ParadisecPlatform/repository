<template>
    <div>
        <div v-if="error">
            <loading-error-component :error="error" source="item" />
        </div>

        <div v-if="!error && item.rocrate" class="flex flex-col">
            <div class="flex flex-row xl:px-8">
                <div class="w-3/4">
                    <div class="my-4 text-3xl">{{item.rocrate.name}}</div>
                    <div>Item: /{{$route.params.domain}}/{{$route.params.collectionId}}/{{$route.params.itemId}}</div>
                    <div>
                        Collection:
                        <router-link :to="item.rocrate.memberOf.id">{{item.rocrate.memberOf.id}}</router-link>
                    </div>
                    <div class="h-2"></div>
                    <div>Author: {{item.rocrate.author.name}}</div>
                    <div>
                        Contributors:
                        <ul class="px-6">
                            <li
                                class="list-disc"
                                v-for="(contributor, idx) of item.rocrate.contributor"
                                :key="idx"
                            >{{contributor.contributor.name}} ({{contributor.name}})</li>
                        </ul>
                    </div>
                    <div class="my-4 px-6 text-xl">
                        <render-description-component :description="item.rocrate.description" />
                    </div>
                </div>
                <div class="hidden lg:block">
                    <render-location-component :geo="item.rocrate.contentLocation" />
                </div>
            </div>
            <data-display-component :data="item" />
            <div class="mt-4">
                <render-content-component :item="item.rocrate" />
            </div>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();
import RenderContentComponent from "./RenderContent.component.vue";
import RenderLocationComponent from "./RenderLocation.component.vue";
import RenderDescriptionComponent from "./RenderDescription.component.vue";
import LoadingErrorComponent from "./LoadingError.component.vue";
import DataDisplayComponent from "./DataDisplay.component.vue";

export default {
    components: {
        RenderContentComponent,
        LoadingErrorComponent,
        RenderDescriptionComponent,
        RenderLocationComponent,
        DataDisplayComponent
    },
    data() {
        return {
            watchers: {},
            error: undefined,
            item: {
                inventory: undefined,
                rocrate: undefined
            }
        };
    },
    mounted() {
        const domain = this.$store.state.configuration.domain;
        if (domain) {
            this.watchers.domain = this.$watch(
                "$route.params.domain",
                this.loadItem
            );
            this.watchers.collectionId = this.$watch(
                "$route.params.collectionId",
                this.loadItem
            );
            this.watchers.itemId = this.$watch(
                "$route.params.itemId",
                this.loadItem
            );
        } else {
            this.watchers.collectionId = this.$watch(
                "$route.params.collectionId",
                this.loadItem
            );
            this.watchers.itemId = this.$watch(
                "$route.params.itemId",
                this.loadItem
            );
        }
        this.loadItem();
    },
    beforeDestroy() {
        if (this.watchers.domain) this.watchers.domain();
        this.watchers.collectionId();
        this.watchers.itemId();
    },
    methods: {
        async loadItem() {
            const domain =
                this.$route.params.domain ||
                this.$store.state.configuration.domain;
            const collectionId = this.$route.params.collectionId;
            const itemId = this.$route.params.itemId;
            try {
                this.item = await dataLoader.loadItem({
                    domain,
                    collectionId,
                    itemId
                });
                this.error = undefined;
            } catch (error) {
                this.error = {
                    status: error.status,
                    statusText: error.statusText,
                    url: error.url
                };
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>