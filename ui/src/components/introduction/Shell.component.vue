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
            const path = this.introductionComponent.match(
                "GenericIntroduction.component.vue"
            )
                ? ""
                : "/domain";
            return () =>
                import(`src/components${path}/${this.introductionComponent}`);
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
            let { introduction } = this.configuration;
            if (!introduction)
                introduction = "introduction/GenericIntroduction.component.vue";
            this.introductionComponent = introduction;
        }
    }
};
</script>

<style lang="scss" scoped></style>
