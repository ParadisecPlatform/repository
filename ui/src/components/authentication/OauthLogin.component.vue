<template>
    <button class="flex-grow flex flex-row space-x-2" @click="login" v-loading="data.loggingIn">
        <div><img :src="image" class="h-8" /></div>
        <div class="text-gray-600 text-lg leading-relaxed">
            {{ props.buttonText }}
        </div>
    </button>
</template>

<script setup>
import { loginSessionKey, putLocalStorage } from "@/storage.js";
import { inject, reactive } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const $store = useStore();
const $route = useRoute();
const $http = inject("$http");

const props = defineProps({
    image: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
});
const data = reactive({
    configuration: $store.getters.getConfiguration.authentication[props.provider],
    scope: "openid profile email",
    loggingIn: false,
});
const image = require(`@/assets/${props.image}`);
async function login() {
    data.loggingIn = true;
    let response = await $http.get({
        route: `/auth/${props.provider}/login?referrer="${window.location}"`,
    });
    if (response.status !== 200) {
        // disabled this login type for now
    }
    let { url, code_verifier } = await response.json();
    putLocalStorage({
        key: loginSessionKey,
        data: { code_verifier, path: $route.path },
    });
    data.loggingIn = false;
    window.location.href = url;
}
</script>
