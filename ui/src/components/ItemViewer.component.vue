<template>
    <div>item: {{$route.params.domain}}/{{$route.params.collectionId}}/{{$route.params.itemId}}</div>
</template>

<script>
export default {
    data() {
        return {
            watchers: {}
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
        loadItem() {
            const domain =
                this.$route.params.domain ||
                this.$store.state.configuration.domain;
            const collectionId = this.$route.params.collectionId;
            const itemId = this.$route.params.itemId;
            console.log(domain, collectionId, itemId);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>