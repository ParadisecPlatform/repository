<template>
    <div class="flex flex-col">
        <div v-if="place">{{ place.name }}</div>
        <render-location-component :box="location.geo.box" :width="width" :height="height" />
    </div>
</template>

<script>
import RenderLocationComponent from "src/components/shared/RenderLocation.component.vue";
export default {
    components: {
        RenderLocationComponent,
    },
    props: {
        contentLocation: {
            type: Array,
            required: true,
        },
        width: {
            type: String,
            default: "300",
        },
        height: {
            type: String,
            default: "300",
        },
    },
    data() {
        return {
            place: this.contentLocation.filter((l) => l["@type"] === "Place" && l?.name)[0],
            location: this.contentLocation.filter((l) => l["@type"] === "Place" && l.geo)[0],
        };
    },
};
</script>
