<template>
    <div>
        <div v-if="error">
            <loading-error-component :error="error" source="item" />
        </div>

        <div v-if="!error && item.rocrate">
            <div class="my-10 text-3xl">{{item.rocrate.name}}</div>
            <div>Item: {{$route.params.domain}}/{{$route.params.collectionId}}/{{$route.params.itemId}}</div>
            <div>Author: {{item.rocrate.author.name}}</div>
            <div>
                Collection:
                <router-link :to="item.rocrate.memberOf.id">{{item.rocrate.memberOf.id}}</router-link>
            </div>
            <div class="flex flex-row my-4">
                <el-button @click="show.inventory= !show.inventory" size="mini">
                    <span v-if="!show.inventory">Show</span>
                    <span v-else>Hide</span>
                    OCFL inventory file
                </el-button>
                <el-button @click="show.crate= !show.crate" size="mini">
                    <span v-if="!show.crate">Show</span>
                    <span v-else>Hide</span>
                    RO-Crate metadata
                </el-button>
                <el-button @click="show.datafiles= !show.datafiles" size="mini">
                    <span v-if="!show.datafiles">Show</span>
                    <span v-else>Hide</span>
                    data files
                </el-button>
            </div>
            <render-content-component :item="item.rocrate" />
            <div v-if="show.inventory" class="bg-white p-8 mx-6 overflow-scroll my-4">
                <div class="text-lg">Item Inventory</div>
                <pre class="text-sm">{{item.inventory}}</pre>
            </div>
            <div v-if="show.crate" class="bg-white p-8 mx-6 overflow-scroll my-4">
                <div class="text-lg">Item RO-Crate</div>
                <pre class="text-sm">{{item.rocrate}}</pre>
            </div>
            <div v-if="show.datafiles" class="bg-white p-8 mx-6 overflow-scroll my-4">
                <div class="text-lg">Item datafiles</div>
                <pre class="text-sm">{{item.datafiles}}</pre>
            </div>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/data-loader.service";
const dataLoader = new DataLoader();
import RenderContentComponent from "./RenderContent.component.vue";
import LoadingErrorComponent from "./LoadingError.component.vue";

export default {
    components: {
        RenderContentComponent,
        LoadingErrorComponent
    },
    data() {
        return {
            watchers: {},
            error: undefined,
            item: {
                inventory: undefined,
                rocrate: undefined
            },
            show: {
                inventory: false,
                crate: false,
                datafiles: false
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