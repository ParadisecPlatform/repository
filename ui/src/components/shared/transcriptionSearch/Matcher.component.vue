<template>
    <div class="flex flex-col">
        <div class="flex flex-row">
            <el-input v-model="value" @change="query"></el-input>
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
                >
                </el-switch>
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
                >
                </el-switch>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: undefined,
            phraseSearch: true,
            operator: "AND"
        };
    },
    methods: {
        query() {
            this.$emit("search", {
                nested: true,
                path: "segment",
                field: "text",
                value: this.value,
                type: "text",
                operator: this.operator,
                phraseSearch: this.phraseSearch
            });
        }
    }
};
</script>

<style lang="scss" scoped></style>
