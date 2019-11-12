<template>
    <div>
        {{desc}}
        <el-button
            class="inline-block"
            @click="toggleFullDescription"
            type="text"
            v-if="description.length >= limit"
        >
            <span v-if="description.length === limit">show less</span>
            <span v-else>show more</span>
        </el-button>
    </div>
</template>

<script>
export default {
    props: {
        description: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            showMore: false,
            limit: 300
        };
    },
    computed: {
        desc: function() {
            if (this.description.length > this.limit) {
                return `${this.description.slice(0, this.limit)}...`;
            } else {
                return this.description;
            }
        }
    },
    methods: {
        toggleFullDescription() {
            this.limit =
                this.limit === 300
                    ? (this.limit = this.description.length)
                    : 300;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>