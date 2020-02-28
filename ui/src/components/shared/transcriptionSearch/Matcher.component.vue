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
            sessionStorageKey: "transcriptionSearch",
            value: undefined,
            phraseSearch: true,
            operator: "AND"
        };
    },
    mounted() {
        let savedSearch = JSON.parse(
            sessionStorage.getItem(this.sessionStorageKey)
        );
        if (savedSearch) {
            this.value = savedSearch.value;
            this.phraseSearch = savedSearch.phraseSearch;
            this.operator = savedSearch.operator;
            this.query();
        }
    },
    methods: {
        query() {
            sessionStorage.setItem(
                this.sessionStorageKey,
                JSON.stringify({
                    value: this.value,
                    phraseSearch: this.phraseSearch,
                    operator: this.operator
                })
            );
            this.$emit("search", {
                nested: true,
                path: "segment",
                field: "text",
                value: this.value,
                type: "text",
                operator: this.operator,
                phraseSearch: this.phraseSearch
            });
        },
        clear() {
            this.value = undefined;
            this.query();
        }
    }
};
</script>

<style lang="scss" scoped></style>
