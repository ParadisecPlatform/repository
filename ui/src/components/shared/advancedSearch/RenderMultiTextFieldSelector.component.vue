<template>
    <div class="flex flex-col">
        <div class="flex flex-row" v-for="(field, idx) of fields" :key="idx">
            <div class="w-20 text-right mr-2 leading-loose">{{field.name}}</div>
            <div class="flex-grow">
                <el-input
                    ref="inputElement"
                    type="text"
                    v-model="field.value"
                    size="small"
                    @change="emitSelection"
                ></el-input>
            </div>
        </div>
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
        return {
            fields: []
        };
    },
    beforeMount() {
        this.fields = this.field.subFields.map(f => {
            return {
                name: f,
                value: undefined
            };
        });
    },
    mounted() {
        this.$refs.inputElement[0].$refs.input.focus();
    },
    methods: {
        emitSelection() {
            this.$emit("change", {
                ...this.field,
                value: this.fields
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>