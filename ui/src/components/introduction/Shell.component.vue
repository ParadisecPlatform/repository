<template>
    <div>
        <component v-bind:is="componentFile"></component>
    </div>
</template>

<script>
export default {
    data() {
        return {
            introductionComponent: undefined
        };
    },
    computed: {
        componentFile: function() {
            if (!this.introductionComponent) return;
            return () => import(`${this.introductionComponent}`);
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    async mounted() {
        this.loadIntroduction({});
    },
    methods: {
        loadIntroduction() {
            let { introductionComponent } = this.configuration;
            if (!introductionComponent)
                introductionComponent = "./GenericIntroduction.component.vue";
            this.introductionComponent = introductionComponent;
        }
    }
};
</script>

<style lang="scss" scoped></style>
