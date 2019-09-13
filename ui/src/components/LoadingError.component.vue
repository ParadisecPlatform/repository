<template>
    <div class="text-center">
        <div v-if="error.status === 404">This {{source}} is currently not available.</div>
    </div>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            required: true
        },
        source: {
            type: String,
            required: true
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
</style>