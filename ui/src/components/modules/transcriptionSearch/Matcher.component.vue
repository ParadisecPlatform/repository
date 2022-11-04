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
                    v-model="phrase"
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
                    v-show="!phrase"
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
            phrase: this.$route.query?.phrase ? this.$route.query.phrase : true,
            operator: this.$route.query?.operator ? this.$route.query.operator : "AND",
        };
    },
    watch: {
        "$route.query": {
            deep: true,
            handler: function() {
                this.value = this.$route.query?.q ? this.$route.query.q : undefined;
                this.phrase = this.$route.query?.phrase === "false" ? false : true;
                this.operator = this.$route.query?.operator ? this.$route.query.operator : "AND";
            },
        },
    },
    methods: {
        query() {
            let page = this.$route.q !== this.value ? 1 : this.$route.query.page;
            if (this.phrase) {
                this.$emit("update", {
                    page,
                    query: this.value,
                    phrase: true,
                });
            } else {
                this.$emit("update", {
                    page,
                    query: this.value,
                    phrase: false,
                    operator: this.operator,
                });
            }
        },
        clear() {
            this.value = undefined;
            this.$emit("update", {
                page: 1,
                query: this.value,
                phrase: true,
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
