<template>
    <div class="flex flex-col"></div>
</template>

<script setup>
import { onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
    loginSessionKey,
    tokenSessionKey,
    putLocalStorage,
    getLocalStorage,
    removeLocalStorage,
} from "@/storage.js";
const $http = inject("$http");
const $route = useRoute();
const $router = useRouter();
const $store = useStore();

onMounted(() => {
    login();
});
async function login() {
    let { code_verifier, path } = getLocalStorage({ key: loginSessionKey });
    removeLocalStorage({ key: loginSessionKey });
    let response = await $http.post({
        route: `/auth/${$route.query.state}/code`,
        body: { code: $route.query.code, code_verifier },
    });
    if (response.status !== 200) {
        await $router.push("/dashboard");
    } else {
        let { token } = await response.json();
        let user = JSON.parse(atob(token.split(".")[1]));
        console.log(JSON.stringify(user, null, 2));
        $store.commit("setUserData", user);

        putLocalStorage({ key: tokenSessionKey, data: { token } });
        await $router.replace(path);
    }
}
</script>
