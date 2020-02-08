<template>
    <div class="mb-4">
        <el-button size="mini" @click="showCollectionInformation = !showCollectionInformation">
            <span v-show="showCollectionInformation">hide</span>
            <span v-show="!showCollectionInformation">show</span>
            collection metadata
        </el-button>
        <div
            class="flex flex-col my-2 bg-yellow-300 p-4 rounded-lg"
            v-if="showCollectionInformation"
        >
            <div v-for="(field, idx) of fields" :key="idx" class="flex flex-row">
                <div class="text-orange-900 font-light">{{ field.label }}:&nbsp;</div>
                <div
                    class="text-gray-700 font-normal tracking-wide"
                    v-if="field.prop && field.prop.length"
                >{{ field.prop }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { date, toBoolean } from "src/filters";
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showCollectionInformation: false,
            fields: [
                {
                    label: "Date Created",
                    prop: date(this.data.objectifiedCrate.dateCreated)
                },
                {
                    label: "Last Update",
                    prop: date(this.data.objectifiedCrate.dateModified)
                },
                {
                    label: "Comments",
                    prop: this.data.objectifiedCrate.comments
                },
                {
                    label: "Deposit Form Received",
                    prop: toBoolean(
                        this.data.objectifiedCrate.depositFormRceived
                    )
                },
                {
                    label: "Media",
                    prop: this.data.objectifiedCrate.media
                },
                {
                    label: "Orthographic Notes",
                    prop: this.data.objectifiedCrate.orthographicNotes
                },
                {
                    label: "Private",
                    prop: toBoolean(this.data.objectifiedCrate.private)
                },
                {
                    label: "License",
                    prop: this.data.objectifiedCrate.license.name
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped></style>
