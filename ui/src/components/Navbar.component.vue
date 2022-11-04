<template>
    <div class="flex flex-row p-4 text-lg font-light text-sky-600">
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
    </div>
</template>

<script setup></script>
