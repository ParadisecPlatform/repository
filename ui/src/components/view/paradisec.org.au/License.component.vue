<template>
    <div class="my-2">
        <el-alert :type="type" :closable="false" effect="dark" :center="true">
            <div class="text-lg text-center">
                {{ data.objectifiedCrate.license.name }}
            </div>
            <div v-if="type === 'error'" class="text-sm">
                {{ data.objectifiedCrate.license.description }}
            </div>
        </el-alert>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            type: undefined
        };
    },
    mounted() {
        try {
            this.type = this.data.objectifiedCrate.license.name.match(/^Open/)
                ? "success"
                : "error";
        } catch (error) {
            this.type = "error";
        }
    }
};
</script>
