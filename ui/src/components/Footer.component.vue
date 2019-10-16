<template>
    <div class="flex flex-row w-full xl:w-3/4 xxl:w-4/6 m-auto h-4">
        <router-link to="/health-check">
            <i class="fas fa-heartbeat"></i> Health Check
        </router-link>
        <router-link to="/about" class="mx-2">
            <i class="fas fa-info-circle"></i> About
        </router-link>
        <div class="flex-grow"></div>
        <div>
            <a href="https://language-archives.services" target="_blank">
                CoEDL Labs
                <i class="fas fa-external-link-alt"></i>
            </a>
        </div>
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
.style-footer-links,
a {
    font-size: 12px;
}
</style>