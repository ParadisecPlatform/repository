<template>
    <div class="flex flex-col">
        <span
            v-if="data.value"
            class="text-sm px-1 m-1 border-b-2 border-gray-500"
        >
            <!-- <div class="text-xs">{{ data.tier }}</div> -->
            <div>
                {{ data.value }}
            </div>
        </span>
        <div class="flex flex-row" v-if="data.children.length">
            <div v-for="(child, idx) of data.children" :key="idx" class="">
                <render-child-component :data="child" v-if="child.value" />
            </div>
        </div>
    </div>
</template>

<script>
import { mixin } from "./RenderTranscriptionMixins";

export default {
    components: {
        RenderChildComponent: () =>
            import("./RenderTranscriptionEAFChild.component.vue")
    },
    props: {
        root: { type: Boolean },
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss" scoped>
@import "src/assets/variables.scss";

.style-segment {
    border-bottom: 1px solid;
    border-color: #b0bec5;
}

.style-text {
    color: $brand-highlight-color;
}
</style>
