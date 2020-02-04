<template>
    <div class="flex flex-row w-full xl:w-3/4 xxl:w-4/6 m-auto py-2 text-sm">
        <router-link to="/" class="px-5">
            <i class="fas fa-home"></i>
            <span class="hidden md:inline">Home</span>
        </router-link>
        <router-link to="/explore" class="px-5">
            <i class="fas fa-search"></i>
            <span class="hidden md:inline">Explore</span>
        </router-link>
        <router-link to="/about" class="px-5 hidden md:block">
            <i class="fas fa-info-circle"></i>
            <span class="hidden md:inline">About</span>
        </router-link>
        <!-- <router-link to="/support" class="px-5 hidden md:block">
            <i class="fas fa-question-circle"></i>
            <span class="hidden md:inline">Support</span>
        </router-link>-->
        <div class="flex-grow"></div>
        <!-- <div>OCFL Catalog Viewer</div> -->
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