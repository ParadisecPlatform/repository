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
import { mixin } from "./FieldMixins";

export default {
    mixins: [mixin],
    data() {
        return { value: undefined };
    },
    mounted() {
        this.$refs.inputElement.$refs.input.focus();
    },
    methods: {
        emitSelection() {
            this.saveState();
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