<template>
    <div>
        <div v-if="error">
            <loading-error-component :error="error" source="collection" />
        </div>

        <div v-if="!error && collection.rocrate">
            <div class="my-10 text-3xl">{{collection.rocrate.name}}</div>
            <div>collection: /{{$route.params.domain}}/{{$route.params.collectionId}}</div>
            <div>Author: {{collection.rocrate.author.name}}</div>
            <div class="inline">
                <div
                    v-if="collectionMembers.length !== collection.rocrate.collectionMembers.length"
                >
                    <el-progress
                        :percentage="collectionMembers.length / collection.rocrate.collectionMembers.length * 100"
                        :show-text="false"
                    ></el-progress>
                </div>

                <span v-else>Items: {{collectionMembers.length}}</span>
            </div>
            <div class="flex flex-wrap">
                <div v-for="(item, idx) of this.collectionMembers" :key="idx">
                    <el-tag type="warning" effect="dark" class="mx-1 my-1" v-if="item.available">
                        <router-link :to="item.id">{{item.name}}</router-link>
                    </el-tag>
                    <el-tag type="info" effect="dark" class="mx-1 my-1" v-else>{{item.name}}</el-tag>
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
import { DataLoader } from "src/services/data-loader.service";
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

                let members = [...this.collection.rocrate.collectionMembers];
                const pauseTime = members.length < 50 ? 50 : 30;
                let data;
                this.collectionMembers = [];
                for (let member of members) {
                    try {
                        data = await dataLoader.load({
                            identifier: member.id,
                            check: true
                        });
                        member.available = true;
                    } catch (error) {
                        member.available = false;
                    }
                    this.collectionMembers.push(member);
                    await new Promise(resolve =>
                        setTimeout(resolve, pauseTime)
                    );
                }
                members = members.map(member => {});
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