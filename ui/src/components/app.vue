<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    el: "#app",
    async mounted() {
        this.$store.dispatch("initialise", { $router: this.$router });
    }
};
</script>

<style scoped>
</style>
