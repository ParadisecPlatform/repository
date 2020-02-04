<template>
    <div>
        <component v-bind:is="componentFile"></component>
    </div>
</template>

<script>
export default {
    data() {
        return {
            headerComponent: undefined
        };
    },
    computed: {
        componentFile: function() {
            if (!this.headerComponent) return;
            return () => import(`${this.headerComponent}`);
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    async mounted() {
        this.loadHeader({});
    },
    methods: {
        loadHeader() {
            let { headerComponent } = this.configuration;
            if (!headerComponent)
                headerComponent = "./GenericHeader.component.vue";
            this.headerComponent = headerComponent;
        }
    }
};
</script>

<style lang="scss" scoped></style>
