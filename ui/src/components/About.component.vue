<template>
    <div class="container mx-auto flex flex-col items-center text-2xl">
        <div class="flex-1 p-5 text-center">About this application</div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        status: function() {
            return this.$store.state.status;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "src/assets/variables.scss";

.style-service {
    min-width: 200px;
    display: inline-block;
}

.style-positive-check {
    color: $brand-success-color;
}

.style-negative-check {
    color: $brand-error-color;
}
</style>