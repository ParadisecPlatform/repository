<template>
    <div v-if="item.rocrate">
        <div class="my-10 text-3xl">{{item.rocrate.name}}</div>
        <div>Item: {{$route.params.domain}}/{{$route.params.collectionId}}/{{$route.params.itemId}}</div>
        <div>Author: {{item.rocrate.author.name}}</div>
        <div class="flex flex-row my-4">
            <el-button @click="showInventory = !showInventory" size="mini">
                <span v-if="!showInventory">Show</span>
                <span v-else>Hide</span>
                OCFL inventory file
            </el-button>
            <el-button @click="showCrate= !showCrate" size="mini">
                <span v-if="!showCrate">Show</span>
                <span v-else>Hide</span>
                RO-Crate metadata
            </el-button>
        </div>
        <render-content-component :content="item.rocrate.hasPart" />
        <div v-if="showInventory" class="bg-white p-8 mx-6 overflow-scroll my-4">
            <div class="text-lg">Item Inventory</div>
            <pre class="text-sm">{{item.inventory}}</pre>
        </div>
        <div v-if="showCrate" class="bg-white p-8 mx-6 overflow-scroll my-4">
            <div class="text-lg">Item RO-Crate</div>
            <pre class="text-sm">{{item.rocrate}}</pre>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/data-loader.service";
const dataLoader = new DataLoader();
import RenderContentComponent from "./RenderContent.component.vue";

export default {
    components: {
        RenderContentComponent
    },
    data() {
        return {
            watchers: {},
            item: {
                inventory: undefined,
                rocrate: undefined
            },
            showInventory: false,
            showCrate: false
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
            this.item = await dataLoader.loadItem({
                domain,
                collectionId,
                itemId
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>