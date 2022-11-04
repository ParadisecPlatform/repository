<template>
    <div class="flex flex-row p-4">
        <introduction-component class="w-1/2 border-violet-200 border-2 rounded m-2 p-4" />
        <item-jumper-component class="w-1/2 bg-white border-violet-200 border-2 rounded m-2 p-4" />
    </div>
</template>

<script setup>
import ItemJumperComponent from "./ItemJumper.component.vue";
import IntroductionComponent from "./introduction/Shell.component.vue";
import { useStore } from "vuex";
</script>
