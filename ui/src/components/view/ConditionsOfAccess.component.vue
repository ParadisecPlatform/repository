<template>
    <div class="flex flex-col space-y-2">
        <div class="flex flex-col space-y-4">
            <div class="text-xl font-bold">Conditions of Access</div>
            <div v-for="(condition, idx) of configuration.ui.conditionsOfAccess" :key="idx">
                <div class="flex flex-row">
                    <div class="w-2/6 lg:w-1/5 font-bold" v-if="condition.section">
                        {{ condition.section }}:
                    </div>
                    <div
                        :class="{
                            'w-4/6 lg:w-full': condition.section,
                            'w-full': !condition.section,
                        }"
                    >
                        {{ condition.text }}
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col space-y-4">
            <el-checkbox v-model="data.checked" @change="data.disableAccept = !data.disableAccept"
                >By clicking here I agree that I will not contravene this licence.
            </el-checkbox>
            <div>
                <el-button
                    type="primary"
                    :disabled="data.disableAccept"
                    size="small"
                    @click="accept"
                    >I agree</el-button
                >
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useStore } from "vuex";
import { isArray, isString } from "lodash";
const $store = useStore();
const $emit = defineEmits(["accept-conditions"]);

const configuration = $store.getters.getConfiguration;

const data = reactive({
    checked: false,
    disableAccept: true,
});
function accept() {
    $emit("accept-conditions");
}
</script>

<style scoped>
.conditions-panel-height {
    height: 700px;
}
</style>
