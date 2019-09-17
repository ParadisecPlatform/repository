<template>
    <div>
        <div v-if="error">
            <loading-error-component :error="error" source="collection" />
        </div>

        <div v-if="!error && collection.rocrate">
            <div class="my-10 text-3xl">{{collection.rocrate.name}}</div>
            <div>collection: {{$route.params.domain}}/{{$route.params.collectionId}}</div>
            <div>Author: {{collection.rocrate.author.name}}</div>
            <div>Items ({{collection.rocrate.collectionMembers.length}}):</div>
            <div class="flex flex-wrap">
                <div v-for="(item, idx) of collection.rocrate.collectionMembers" :key="idx">
                    <el-tag type="warning" effect="dark" class="mx-1 my-1">
                        <router-link :to="item.id">{{item.name}}</router-link>
                    </el-tag>
                </div>
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
            <div v-if="show.inventory" class="bg-white p-8 mx-6 overflow-scroll my-4">
                <div class="text-lg">Collection Inventory</div>
                <pre class="text-sm">{{collection.inventory}}</pre>
            </div>
            <div v-if="show.crate" class="bg-white p-8 mx-6 overflow-scroll my-4">
                <div class="text-lg">Collection RO-Crate</div>
                <pre class="text-sm">{{collection.rocrate}}</pre>
            </div>
            <div v-if="show.datafiles" class="bg-white p-8 mx-6 overflow-scroll my-4">
                <div class="text-lg">Collection datafiles</div>
                <pre class="text-sm">{{collection.datafiles}}</pre>
            </div>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/data-loader.service";
const dataLoader = new DataLoader();
import LoadingErrorComponent from "./LoadingError.component.vue";

export default {
    components: {
        LoadingErrorComponent
    },
    data() {
        return {
            watchers: {},
            error: undefined,
            collection: {
                inventory: undefined,
                rocrate: undefined
            },
            collectionMembers: [],
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
                this.loadCollection
            );
            this.watchers.collectionId = this.$watch(
                "$route.params.collectionId",
                this.loadCollection
            );
        } else {
            this.watchers.collectionId = this.$watch(
                "$route.params.collectionId",
                this.loadCollection
            );
        }
        this.loadCollection();
    },
    beforeDestroy() {
        if (this.watchers.domain) this.watchers.domain();
        this.watchers.collectionId();
    },
    methods: {
        async loadCollection() {
            const domain =
                this.$route.params.domain ||
                this.$store.state.configuration.domain;
            const collectionId = this.$route.params.collectionId;
            try {
                this.collection = await dataLoader.loadCollection({
                    domain,
                    collectionId
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