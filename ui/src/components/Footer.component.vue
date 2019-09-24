<template>
    <div class="flex flex-row w-full xl:w-3/4 xxl:w-1/2 m-auto h-4">
        <router-link to="/health-check">
            <i class="fas fa-heartbeat"></i> Health Check
        </router-link>
        <div class="flex-grow"></div>
        <div>
            <a href="https://language-archives.services" target="_blank">
                by the CoEDL
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