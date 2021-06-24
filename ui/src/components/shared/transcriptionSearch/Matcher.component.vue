<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <el-button @click="clear" type="danger" size="small">
                <i class="fas fa-trash-alt"></i>
            </el-button>
            <el-input class="mx-2" v-model="value" @change="query"></el-input>
            <el-button @click="query">search</el-button>
        </div>
        <div class="flex flex-row my-2">
            <div>
                <el-switch
                    class="style-component"
                    v-model="phraseSearch"
                    active-color="#dd6b20"
                    active-text="phrase search"
                    inactive-text="keyword search"
                    @change="query"
                ></el-switch>
            </div>
            <div class="w-20"></div>
            <div>
                <el-switch
                    class="style-component"
                    v-show="!phraseSearch"
                    v-model="operator"
                    active-color="#dd6b20"
                    active-text="AND"
                    active-value="AND"
                    inactive-text="OR"
                    inactive-value="OR"
                    @change="query"
                ></el-switch>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: this.$route.query?.q ? this.$route.query.q : undefined,
            phraseSearch: this.$route.query?.phrase ? this.$route.query.phrase : true,
            operator: this.$route.query?.operator ? this.$route.query.operator : "AND",
        };
    },
    mounted() {
        this.query();
    },
    watch: {
        "$route.query.value": function() {
            this.value = this.$route.query?.q ? this.$route.query.q : undefined;
        },
        "$route.query.phraseSearch": function() {
            this.phraseSearch = this.$route.query?.phrase ? this.$route.query.phrase : true;
        },
        "$route.query.operator": function() {
            this.operator = this.$route.query?.operator ? this.$route.query.operator : "AND";
        },
    },
    methods: {
        query() {
            this.$emit("search", {
                value: this.value,
                phraseSearch: this.phraseSearch,
                operator: this.operator,
            });
        },
        clear() {
            this.value = undefined;
            this.query();
        },
    },
};
</script>

<style lang="scss" scoped></style>
