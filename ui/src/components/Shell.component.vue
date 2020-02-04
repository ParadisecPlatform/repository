<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";

export default {
    components: {},
    data() {
        return {
            watchers: {}
        };
    }
};
</script>