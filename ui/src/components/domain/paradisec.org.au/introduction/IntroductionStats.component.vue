<template>
    <div class="flex flex-row justify-around my-4 text-center">
        <div class="flex flex-col">
            <div class="text-sm">Collections</div>
            <div class="text-5xl text-orange-500">{{ format(stats.collection) }}</div>
        </div>
        <div class="flex flex-col">
            <div class="text-sm">Items</div>
            <div class="text-5xl text-orange-500">{{ format(stats.item) }}</div>
        </div>
        <div class="flex flex-col">
            <div class="text-sm">Universities</div>
            <div class="text-5xl text-orange-500">{{ format(stats.publishers) }}</div>
        </div>
        <div class="flex flex-col">
            <div class="text-sm">Contributors</div>
            <div class="text-5xl text-orange-500">{{ format(stats.contributors)}}</div>
        </div>
    </div>
</template>

<script>
import { SearchService } from "../search.service";
import VueApexCharts from "vue-apexcharts";
import numeral from "numeral";

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
    },
    methods: {
        format(number) {
            return numeral(number).format("0,0");
        }
    }
};
</script>

<style lang="scss" scoped></style>
