<template>
    <div class="flex flex-col justify-center">
        <div class="text-center">
            <el-pagination
                :background="true"
                layout="prev, pager, next"
                :page-size="1"
                :total="totalImages"
                @current-change="update"
            ></el-pagination>
            {{page}}
        </div>
        <div class="mt-4">
            <div class="text-center">{{items[currentImage].image.displayName}}</div>
            <div>
                <img :src="items[currentImage].image.path" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        items: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            page: 0,
            currentImage: Object.keys(this.items)[0],
            totalImages: Object.keys(this.items).length,
            imageNames: Object.keys(this.items)
        };
    },
    methods: {
        update(number) {
            this.currentImage = this.imageNames[number - 1];
        }
        // previous(value) {
        //     console.log("previous", value);
        // },
        // next(value) {
        //     console.log("next", value);
        // }
    }
};
</script>

<style lang="scss" scoped>
</style>