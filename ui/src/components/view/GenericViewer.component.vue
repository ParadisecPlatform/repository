<template>
    <div>
        <data-display-component :data="data" />

        <div class="flex flex-col">
            <div class="flex flex-row xl:px-8">
                <div class="w-3/4">
                    <div class="my-4 text-3xl">
                        {{ data.objectifiedCrate.name }}
                    </div>
                    <div class="my-4 px-6 text-xl">
                        <render-description-component
                            :description="data.objectifiedCrate.description"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DataDisplayComponent from "src/components/shared/DataDisplay.component.vue";
import RenderDescriptionComponent from "src/components/shared/RenderDescription.component.vue";

export default {
    components: {
        DataDisplayComponent,
        RenderDescriptionComponent
    },
    props: {
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

<style lang="scss" scoped></style>
