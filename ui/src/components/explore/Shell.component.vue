<template>
    <div>
        <component v-bind:is="componentFile"></component>
    </div>
</template>

<script>
export default {
    data() {
        return {
            exploreComponent: undefined
        };
    },
    computed: {
        componentFile: function() {
            if (!this.exploreComponent) return;
            const path = this.exploreComponent.match(
                "GenericExplore.component.vue"
            )
                ? ""
                : "/domain";
            return () =>
                import(`src/components${path}/${this.exploreComponent}`);
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    async mounted() {
        this.loadExplorer({});
    },
    methods: {
        loadExplorer() {
            let { explore } = this.configuration;
            if (!explore) explore = "explore/GenericExplore.component.vue";
            this.exploreComponent = explore;
        }
    }
};
</script>

<style lang="scss" scoped></style>
