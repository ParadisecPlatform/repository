<template>
    <div>
        <div class="underline">Date</div>
        <el-radio-group v-model="field" @change="loadDates">
            <el-radio label="dateCreated">created</el-radio>
            <el-radio label="dateModified">modified</el-radio>
        </el-radio-group>
        <el-date-picker
            type="monthrange"
            size="small"
            v-model="selectedDateRange"
            unlink-panels
            range-separator="-"
            start-placeholder="Start date"
            end-placeholder="End date"
            format="MMM yyyy"
            :clearable="true"
            :picker-options="pickerOptions"
            @change="validateDateSelection"
            @onPick="validateDateSelection"
        ></el-date-picker>
    </div>
</template>

<script>
import { SearchService } from "./search.service";
import { parseISO, isBefore, isAfter, subDays, subMonths } from "date-fns";
export default {
    data() {
        return {
            watchers: {},
            dates: [],
            selectedDateRange: {},
            dateBounds: {},
            field: "dateCreated",
            pickerOptions: {
                shortcuts: [
                    {
                        text: "Past Week",
                        onClick(picker) {
                            picker.$emit("pick", [
                                subDays(new Date(), 7),
                                new Date()
                            ]);
                        }
                    },
                    {
                        text: "Past Month",
                        onClick(picker) {
                            picker.$emit("pick", [
                                subMonths(new Date(), 1),
                                new Date()
                            ]);
                        }
                    },
                    {
                        text: "Past Quarter",
                        onClick(picker) {
                            picker.$emit("pick", [
                                subMonths(new Date(), 3),
                                new Date()
                            ]);
                        }
                    },
                    {
                        text: "Past Year",
                        onClick(picker) {
                            picker.$emit("pick", [
                                subMonths(new Date(), 12),
                                new Date()
                            ]);
                        }
                    }
                ]
            }
        };
    },
    computed: {
        searchResults: function() {
            return this.$store.state.search.results;
        }
    },
    async mounted() {
        this.search = new SearchService({ store: this.$store });
        this.loadDates({});
        this.watchers.searchResults = this.$watch(
            "searchResults",
            this.loadDates
        );
    },
    beforeDestroy() {
        if (this.watchers.searchResults) this.watchers.searchResults();
    },
    methods: {
        async loadDates() {
            this.dateBounds = await this.search.getDateRange({
                field: this.field
            });
            this.selectedDateRange = [this.dateBounds.min, this.dateBounds.max];
        },
        validateDateSelection(date) {
            if (!date) {
                this.selectedDateRange = [
                    parseISO(this.dateBounds.min),
                    parseISO(this.dateBounds.max)
                ];
            } else {
                if (isBefore(date[0], parseISO(this.dateBounds.min))) {
                    this.selectedDateRange[0] = parseISO(this.dateBounds.min);
                }
                if (isAfter(date[1], parseISO(this.dateBounds.max))) {
                    this.selectedDateRange[1] = parseISO(this.dateBounds.max);
                }
                this.search.applyFilter({
                    filter: {
                        field: this.field,
                        dateRange: {
                            min: this.selectedDateRange[0].toISOString(),
                            max: this.selectedDateRange[1].toISOString()
                        }
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>