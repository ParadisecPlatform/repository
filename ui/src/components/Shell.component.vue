<template>
    <div>
        <div v-if="showIntroduction" class="mt-10">
            <introduction-component></introduction-component>
        </div>
        <router-view v-else></router-view>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
import IntroductionComponent from "./Introduction.component.vue";

export default {
    components: {
        IntroductionComponent
    },
    data() {
        return {
            watchers: {},
            showIntroduction: true
        };
    },
    mounted() {
        this.setup();
        this.watchers.routeWatcher = this.$watch("$route.path", this.setup);
    },
    beforeDestroy() {
        this.watchers.routeWatcher();
    },
    methods: {
        setup() {
            this.showIntroduction = this.$route.path === "/" ? true : false;
        }
    }
};
</script>