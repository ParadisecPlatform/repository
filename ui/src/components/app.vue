<template>
    <div class="flex flex-col h-full">
        <header class="fixed z-10 top-0 py-1 px-4 bg-gray-200 w-full">
            <div class="w-full xl:w-3/4 xxl:w-5/6 m-auto">
                <header-component></header-component>
            </div>
        </header>
        <div id="content" class="w-full xl:w-3/4 xxl:w-5/6 py-4 px-4 m-auto mt-10 pb-16">
            <router-view></router-view>
        </div>
        <div class="w-full py-2 px-4 fixed z-10 bottom-0 bg-gray-200">
            <div class="w-full xl:w-3/4 xxl:w-5/6 m-auto">
                <footer-component />
            </div>
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
