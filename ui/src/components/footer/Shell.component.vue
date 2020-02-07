<template>
    <div>
        <component v-bind:is="componentFile"></component>
    </div>
</template>

<script>
export default {
    data() {
        return {
            footerComponent: undefined
        };
    },
    computed: {
        componentFile: function() {
            if (!this.footerComponent) return;
            const path = this.footerComponent.match(
                "GenericFooter.component.vue"
            )
                ? ""
                : "/domain";
            return () =>
                import(`src/components${path}/${this.footerComponent}`);
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    async mounted() {
        this.loadFooter({});
    },
    methods: {
        loadFooter() {
            let { footer } = this.configuration;
            if (!footer) footer = "footer/GenericFooter.component.vue";
            this.footerComponent = footer;
        }
    }
};
</script>

<style lang="scss" scoped></style>
