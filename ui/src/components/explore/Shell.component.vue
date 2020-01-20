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
            return () => import(`${this.exploreComponent}`);
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
            let { exploreComponent } = this.configuration;
            if (!exploreComponent)
                exploreComponent = "./SimpleSearch.component.vue";
            this.exploreComponent = exploreComponent;
        }
    }
};
</script>

<style lang="scss" scoped></style>
