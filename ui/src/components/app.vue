<template>
    <div class="flex flex-col h-full">
        <header class="w-full pin-t p-4 style-header">
            <header-component></header-component>
        </header>
        <div id="content" class="flex-1 px-4 py-2">
            <router-view></router-view>
        </div>
        <footer class="w-full pin-b style-footer p-4">
            <div class="text-xs">
                <router-link to="/health-check">
                    <i class="fas fa-heartbeat"></i> Health Check
                </router-link>
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
</style>
