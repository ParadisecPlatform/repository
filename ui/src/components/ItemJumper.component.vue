<template>
    <div class="flex flex-col space-y-2 p-6">
        <div class="flex flex-row space-x-1">
            <div class="w-32 text-right text-sm mr-2">View Collection:</div>
            <div>/</div>
            <div>
                <el-input
                    v-model="data.collectionId"
                    placeholder="collection id"
                    @change="viewCollection"
                ></el-input>
            </div>
            <div>
                <el-button type="success" @click="viewCollection">
                    <i class="fas fa-arrow-right fa-fw"></i>
                </el-button>
            </div>
        </div>
        <div class="flex flex-row space-x-1">
            <div class="w-32 text-right text-sm mr-2">View Item:</div>
            <div v-if="configuration.links === 'paradisec'" class="flex flex-row space-x-1">
                <div>/</div>
                <el-input v-model="data.collectionId" placeholder="collection id"></el-input>
            </div>
            <div>/</div>
            <div>
                <el-input v-model="data.itemId" placeholder="item id" @change="viewItem"></el-input>
            </div>
            <div>
                <el-button type="success" @click="viewItem">
                    <i class="fas fa-arrow-right fa-fw"></i>
                </el-button>
            </div>
        </div>
        <div v-if="data.message" class="mt-3">
            <el-alert type="warning" :closable="false">{{ data.message }}</el-alert>
        </div>
    </div>
</template>

<script setup>
import { reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const $router = useRouter();
const $store = useStore();

const configuration = $store.getters.getConfiguration;

const data = reactive({
    collectionId: undefined,
    itemId: undefined,
    message: undefined,
});
function viewCollection() {
    if (!data.collectionId) {
        data.message = "Please specify a collection identifier.";
        return;
    }
    $router.push(`/collections/${data.collectionId}`);
}
function viewItem() {
    if (configuration.links === "paradisec") {
        if (!data.collectionId || !data.itemId) {
            data.message = "Please specify a collection and item identifier.";
            return;
        }
        $router.push(`/collections/${data.collectionId}/items/${data.itemId}`);
    } else {
        if (!data.itemId) {
            data.message = "Please specify an item identifier.";
            return;
        }
        $router.push(`/items/${data.itemId}`);
    }
}
</script>
