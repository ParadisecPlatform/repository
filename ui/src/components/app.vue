<template>
    <div class="flex flex-col h-full">
        <header class="fixed z-10 top-0 py-1 px-4 bg-gray-200 w-full">
            <header-component></header-component>
        </header>
        <div
            id="content"
            class="w-full xl:w-3/4 xxl:w-4/6 py-4 px-4 m-auto mt-10 pb-16 bg-gray-100"
        >
            <router-view></router-view>
        </div>
        <div class="w-full py-2 px-4 fixed z-10 bottom-0 bg-gray-200">
            <footer-component />
        </div>
    </div>
</template>

<script>
import HeaderComponent from "./header/Shell.component.vue";
import FooterComponent from "./footer/Shell.component.vue";

export default {
    el: "#app",
    components: {
        HeaderComponent,
        FooterComponent
    }
};
</script>

<style lang="scss" scoped></style>
