<template>
    <div class="my-2">
        <div v-if="licenseDefined">
            <el-alert :type="type" :closable="false" effect="dark" :center="true">
                <div class="text-lg text-center">{{ data.objectifiedCrate.license.name }}</div>
                <div
                    v-if="type === 'error'"
                    class="text-sm"
                >{{ data.objectifiedCrate.license.description }}</div>
            </el-alert>
        </div>
        <div v-else>
            <el-alert type="warning" :closable="false" effect="dark" :center="true">
                <span class="text-lg">No license seems to be defined for this item</span>
            </el-alert>
        </div>
    </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            licenseDefined:
                isEmpty(this.data.objectifiedCrate.license.name) &&
                isEmpty(this.data.objectifiedCrate.license.description)
                    ? false
                    : true,
            showLicenseName: isEmpty(this.data.objectifiedCrate.license.name)
                ? false
                : true,
            showLicenseDescription: isEmpty(this.data.objectifiedCrate.license)
                .description
                ? false
                : true
        };
    },
    computed: {
        type: function() {
            try {
                return this.data.objectifiedCrate.license.name.match(/^Open/)
                    ? "success"
                    : "error";
            } catch (error) {
                return "error";
            }
        }
    }
};
</script>
