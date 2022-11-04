<template>
    <div class="flex flex-col">
        <navbar-component class="bg-sky-100" />
        <router-view class="mt-2" />
    </div>
</template>

<script setup>
import NavbarComponent from "./Navbar.component.vue";
import { useRoute, useRouter } from "vue-router";

const $route = useRoute();
const $router = useRouter();
if ($route.path === "/") $router.replace("/dashboard");
</script>
