<template>
    <div class="flex flex-col">
        <oauth-login-component
            v-for="provider of data.loginProviders"
            :key="provider.name"
            :provider="provider.name"
            :image="provider.icon"
            :button-text="provider.text"
            class="border-l-4 border-solid p-4 cursor-pointer hover:border-yellow-400 hover:bg-yellow-100 focus:ring-2 focus:ring-yellow-100"
        />
    </div>
</template>

<script setup>
import { reactive, computed, defineAsyncComponent } from "vue";
import { useStore } from "vuex";
const $store = useStore();

const OauthLoginComponent = defineAsyncComponent(() =>
    import("@/components/authentication/OauthLogin.component.vue")
);

const data = reactive({
    loginProviders: [
        { name: "aaf", icon: "aaf.png", text: "Login with the AAF" },
        { name: "google", icon: "google.png", text: "Login with Google" },
    ],
});
let enableGoogleLogin = computed(() => {
    return $store.getters.getConfiguration.authentication.includes("google");
});
let enableAafLogin = computed(() => {
    return $store.getters.getConfiguration.authentication.includes("aaf");
});
</script>
