<template>
    <div>
        <el-date-picker
            v-model="value"
            type="monthrange"
            range-separator="-"
            start-placeholder="Start month"
            end-placeholder="End month"
            size="small"
            align="center"
            @change="emitSelection"
        ></el-date-picker>
    </div>
</template>

<script>
import { mixin } from "./FieldMixins";

export default {
    mixins: [mixin],
    data() {
        return { value: undefined };
    },
    mounted() {},
    methods: {
        emitSelection() {
            this.$emit("change", {
                ...this.field,
                value: this.value,
            });
        },
    },
};
</script>

<style lang="scss" scoped></style>
