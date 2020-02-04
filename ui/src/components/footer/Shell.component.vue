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
            return () => import(`${this.footerComponent}`);
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
            let { footerComponent } = this.configuration;
            if (!footerComponent)
                footerComponent = "./GenericFooter.component.vue";
            this.footerComponent = footerComponent;
        }
    }
};
</script>

<style lang="scss" scoped></style>
