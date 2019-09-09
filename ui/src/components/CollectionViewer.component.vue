<template>
    <div class="flex flex-col">
        <div>collection: {{$route.params.domain}}/{{$route.params.collectionId}}</div>
        <div>
            <pre>{{collection}}</pre>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/data-loader.service";
const dataLoader = new DataLoader();

export default {
    data() {
        return {
            watchers: {},
            collection: {}
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
            this.collection = await dataLoader.loadCollection({
                domain,
                collectionId
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>