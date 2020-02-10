<template>
    <div>
        <el-input
            ref="inputElement"
            type="text"
            v-model="value"
            @change="emitSelection"
            size="small"
        ></el-input>
    </div>
</template>

<script>
export default {
    props: {
        field: {
            type: Object,
            required: true
        }
    },
    data() {
        return { value: undefined };
    },
    mounted() {
        this.$refs.inputElement.$refs.input.focus();
    },
    methods: {
        emitSelection() {
            this.$emit("change", {
                ...this.field,
                value: this.value
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>