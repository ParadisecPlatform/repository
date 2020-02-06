<template>
    <div>
        <div class="underline my-2">Recently Updated Content</div>

        <div class="flex flex-row flex-wrap justify-around">
            <div v-for="(item, idx) of items" :key="idx" @click="$router.push(item.id)">
                <el-card class="w-64 m-1 hover:bg-orange-200 cursor-pointer">
                    <div slot="header">{{ item.name }}</div>
                    <div>{{trimDescription(item.description)}}</div>
                    <div class="flex flex-row text-3xl text-orange-600">
                        <div v-if="item.contentTypes.images" class="mx-2">
                            <i class="far fa-file-image"></i>
                        </div>
                        <div v-if="item.contentTypes.audio" class="mx-2">
                            <i class="far fa-file-audio"></i>
                        </div>
                        <div v-if="item.contentTypes.video" class="mx-2">
                            <i class="far fa-file-video"></i>
                        </div>
                        <div v-if="item.contentTypes.documents" class="mx-2">
                            <i class="far fa-file-pdf"></i>
                        </div>
                        <div v-if="item.contentTypes.transcriptions" class="mx-2">
                            <i class="far fa-file-alt"></i>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import { SearchService } from "../search.service";

export default {
    data() {
        return {
            items: [],
            maxDescriptionLength: 300
        };
    },
    mounted() {
        this.ss = new SearchService({ store: this.$store });
        this.loadRecentlyUpdatedItems();
    },
    methods: {
        async loadRecentlyUpdatedItems() {
            const response = await this.ss.getRecentlyUpdatedItems({
                size: 10
            });
            this.items = response.documents;
        },
        trimDescription(description) {
            if (description.length > this.maxDescriptionLength)
                return `${description.slice(0, this.maxDescriptionLength)}...`;
            return description;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>
