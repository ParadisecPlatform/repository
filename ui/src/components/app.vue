<template>
    <div class="flex flex-col h-full">
        <header class="w-full p-4 style-header fixed z-10 top-0 style-background">
            <header-component></header-component>
        </header>
        <div id="content" class="w-full xl:w-3/4 xxl:w-1/2 px-4 m-auto mt-16 pb-16">
            <router-view></router-view>
        </div>
        <div
            class="w-full style-footer p-4 fixed z-10 bottom-0 style-background style-footer-links"
        >
            <footer-component />
        </div>
    </div>
</template>

<script>
import HeaderComponent from "./Header.component.vue";
import FooterComponent from "./Footer.component.vue";

export default {
    el: "#app",
    components: {
        HeaderComponent,
        FooterComponent
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
