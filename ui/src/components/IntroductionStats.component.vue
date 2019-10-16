<template>
    <div class="my-4">
        <div class="flex flex-row flex-wrap my-5 justify-center" v-if="show">
            <apex-chart
                width="200"
                type="donut"
                v-for="(chart, idx) of chart"
                :key="idx"
                :options="chart"
                :series="chart.series"
            ></apex-chart>
        </div>
    </div>
</template>

<script>
import { SearchService } from "./explore/search.service";
import VueApexCharts from "vue-apexcharts";

export default {
    components: {
        apexChart: VueApexCharts
    },
    data() {
        return {
            show: false,
            content: ["types", "domains", "authors", "publishers"],
            chart: []
        };
    },
    async mounted() {
        try {
            const search = new SearchService({ store: this.$store });
            let stats = await search.getStats();
            for (let c of this.content) {
                this.chart.push({
                    labels: stats[c].map(d => {
                        return `${d.key} (${d.doc_count})`;
                    }),
                    chart: {
                        type: "donut"
                    },
                    dataLabels: {
                        enabled: false
                    },
                    legend: {
                        position: "bottom",
                        floating: true
                    },
                    title: {
                        text: c.toUpperCase(),
                        align: "center"
                    },
                    series: stats[c].map(d => d.doc_count)
                });
            }
            this.show = true;
        } catch (error) {
            // do nothing
        }
    }
};
</script>

<style lang="scss" scoped>
</style>