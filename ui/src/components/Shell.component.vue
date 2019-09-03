<template>
    <div>i'm here</div>
</template>

<script>
import { DataLoader } from "src/data-loader.service";

export default {
    data() {
        return {};
    },
    mounted() {
        const dataLoader = new DataLoader({ $router: this.$router });
        (async () => {
            await dataLoader.verifyRepositoryMounted();
            await dataLoader.verifyServicesAvailable();
        })();
    }
};
</script>