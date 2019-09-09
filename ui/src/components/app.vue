<template>
    <div class="flex flex-col h-full">
        <header class="w-full p-4 style-header fixed z-10 top-0 style-background">
            <header-component></header-component>
        </header>
        <div id="content" class="flex-1 px-4 py-2 mt-24 pb-10">
            <router-view></router-view>
        </div>
        <footer
            class="w-full p-2 style-footer fixed z-10 bottom-0 style-background style-footer-links"
        >
            <div class="text-xs">
                <router-link to="/health-check">
                    <i class="fas fa-heartbeat"></i> Health Check
                </router-link>
                <div class="float-right">
                    <a
                        href="http://language-archives.services"
                        target="_blank"
                    >Another fine product from the CoEDL</a>
                </div>
            </div>
        </footer>
    </div>
</template>

<script>
import HeaderComponent from "./Header.component.vue";
export default {
    el: "#app",
    components: {
        HeaderComponent
    }
};
</script>

<style lang="scss" scoped>
.style-background {
    background-color: #e4e9ed;
}

.style-footer-links,
a {
    font-size: 12px;
}
</style>
