<template>
    <div class="flex flex-row p-4 text-lg font-light text-gray-800">
        <router-link to="/dashboard" query="" class="px-5">
            <i class="fas fa-home"></i>
            <span class="hidden md:inline">&nbsp;Home</span>
        </router-link>
        <!-- <router-link to="/advanced-search" query="" class="px-5">
            <i class="fas fa-search"></i>
            <span class="hidden md:inline">&nbsp;Advanced Search</span>
        </router-link> -->
        <!-- <router-link to="/transcription-search" query="" class="px-5">
            <i class="far fa-file"></i>
            <span class="hidden md:inline">&nbsp;Transcription Search</span>
        </router-link> -->
        <div class="flex-grow"></div>
        <!-- <router-link to="/about" query="" class="px-5 hidden md:block">
            <i class="fas fa-info-circle"></i>
            <span class="hidden md:inline">&nbsp;About</span>
        </router-link> -->
        <el-dropdown trigger="click" v-if="!isLoggedIn">
            <div class="text-lg">Login</div>
            <template #dropdown>
                <login-component />
            </template>
        </el-dropdown>
        <div class="flex flex-row text-lg" v-if="isLoggedIn">
            <div>{{ data.user.givenName }} {{ data.user.familyName }} &nbsp;</div>
            <div @click="logout" class="cursor-pointer">
                <i class="fa-solid fa-right-from-bracket fa-fw"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import LoginComponent from "./Login.component.vue";
import { inject, onMounted, reactive, computed } from "vue";
import { isEmpty } from "lodash";
import { tokenSessionKey, removeLocalStorage } from "@/storage.js";
import { useStore } from "vuex";
const $store = useStore();
const $http = inject("$http");

const data = reactive({
    user: {
        ...$store.state.user,
        isLoggedIn: !isEmpty($store.state.user) ? true : false,
    },
});
let isLoggedIn = computed(() => {
    return !isEmpty($store.state.user) ? true : false;
});
onMounted(() => {
    checkLoginStatus();
});

async function checkLoginStatus() {
    let response = await $http.get({ route: "/authenticated" });
    if (response.status === 200) {
        let { user } = await response.json();
        $store.commit("setUserData", user);
    }
}

async function logout() {
    await $http.get({ route: "/logout" });
    removeLocalStorage({ key: tokenSessionKey });
    $store.commit("setUserData", {});
}
</script>
