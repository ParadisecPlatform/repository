<template>
    <div class="flex flex-col h-full">
        <header class="fixed z-10 top-0 py-1 px-4 style-background w-full">
            <header-component></header-component>
        </header>
        <div id="content" class="w-full xl:w-3/4 xxl:w-4/6 py-4 px-4 m-auto mt-8 pb-16">
            <router-view></router-view>
        </div>
        <div
            class="w-full style-footer py-2 px-4 fixed z-10 bottom-0 style-background style-footer-links"
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
