<template>
    <div>
        <div class="flex justify-center">
            <div class="text-3xl style-heading">OCFL Catalog Viewer</div>
        </div>
        <div class="flex flex-col mt-5">
            <p>
                This application is a Proof of Concept demonstrating a single
                page application operating over an OCFL on-disk repository with
                search capability provided via Elastic Search. Read
                <router-link to="/about">the about page</router-link>&nbsp;to
                find out more.
            </p>
        </div>
        <div class="mt-4 inline">
            Search the catalog via
            <router-link to="/explore" class="inline">explore</router-link>.
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {};
    },
    computed: {
        status: function() {
            return this.$store.state.status;
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    methods: {
        route(target) {
            return `/view/${target}`;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "assets/variables.scss";

.style-heading {
    color: $brand-primary-color;
}
</style>
