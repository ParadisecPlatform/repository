<template>
    <div class="py-4 px-2">
        <div class="flex flex-row">
            <div class="w-32 text-right text-sm mr-2">View Collection:</div>
            <el-input
                class="w-32"
                v-model="collectionId"
                size="mini"
                placeholder="collection id"
                @change="viewCollection"
            ></el-input>
            <el-button
                type="success"
                size="mini"
                @click="viewCollection"
                class="mx-1"
            >
                <i class="fas fa-arrow-right fa-fw"></i>
            </el-button>
        </div>
        <div class="flex flex-row mt-2">
            <div class="w-32 text-right text-sm mr-2">View Item:</div>
            <el-input
                class="w-32"
                v-model="collectionId"
                size="mini"
                placeholder="collection id"
            ></el-input>
            <div class="mx-2">/</div>
            <el-input
                class="w-40"
                v-model="itemId"
                size="mini"
                placeholder="item id"
                @change="viewItem"
            ></el-input>
            <el-button
                type="success"
                size="mini"
                @click="viewItem"
                class="mx-1"
            >
                <i class="fas fa-arrow-right"></i>
            </el-button>
        </div>
        <div v-if="message" class="mt-3">
            <el-alert type="warning" size="mini" :closable="false">{{
                message
            }}</el-alert>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            collectionId: undefined,
            itemId: undefined,
            message: undefined
        };
    },
    methods: {
        viewCollection() {
            if (!this.collectionId) {
                this.message = "Please specify a collection identifier.";
                return;
            }
            this.$router.push(`/view/${this.collectionId}`);
        },
        viewItem() {
            if (!this.collectionId || !this.itemId) {
                this.message =
                    "Please specify a collection and item identifier.";
                return;
            }
            this.$router.push(`/view/${this.collectionId}/${this.itemId}`);
        }
    }
};
</script>

<style lang="scss" scoped></style>
