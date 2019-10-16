<template>
    <div class="flex flex-row w-full xl:w-3/4 xxl:w-4/6 m-auto py-4">
        <router-link to="/" class="px-5">
            <i class="fas fa-home"></i>
            <span class="hidden md:inline">Home</span>
        </router-link>
        <router-link to="/explore" class="px-5">
            <i class="fas fa-search"></i>
            <span class="hidden md:inline">Explore</span>
        </router-link>
        <router-link to="/about" class="hidden md:block">
            <i class="fas fa-info-circle"></i> About
        </router-link>
        <div class="flex-grow"></div>
        <div>OCFL Catalog Viewer</div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
</style>