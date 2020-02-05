<template>
    <div class="flex flex-row justify-around my-4 text-center">
        <div class="flex flex-col">
            <div class="text-sm">Collections</div>
            <div class="text-5xl text-orange-500">{{ stats.collection }}</div>
        </div>
        <div class="flex flex-col">
            <div class="text-sm">Items</div>
            <div class="text-5xl text-orange-500">{{ stats.item }}</div>
        </div>
        <div class="flex flex-col">
            <div class="text-sm">Publishers</div>
            <div class="text-5xl text-orange-500">{{ stats.publishers }}</div>
        </div>
        <div class="flex flex-col">
            <div class="text-sm">Contributors</div>
            <div class="text-5xl text-orange-500">{{ stats.contributors }}</div>
        </div>
    </div>
</template>

<script>
import { SearchService } from "../search.service";
import VueApexCharts from "vue-apexcharts";

export default {
    components: {
        apexChart: VueApexCharts
    },
    data() {
        return {
            chartWidth: 200,
            show: false,
            stats: {}
        };
    },
    async mounted() {
        try {
            const search = new SearchService({ store: this.$store });
            this.stats = await search.getStats();
            this.show = true;
        } catch (error) {
            // do nothing
        }
    }
};
</script>

<style lang="scss" scoped></style>
