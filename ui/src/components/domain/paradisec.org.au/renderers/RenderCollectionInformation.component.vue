<template>
    <div class="mb-4">
        <!-- <el-button
            type="primary"
            size="mini"
            @click="showCollectionInformation = !showCollectionInformation"
        >
            <span v-show="showCollectionInformation">hide</span>
            <span v-show="!showCollectionInformation">show</span>
            collection metadata
        </el-button> -->
        <div
            class="flex flex-col my-2 bg-yellow-300 p-4 rounded-lg"
            v-if="showCollectionInformation"
        >
            <div v-for="(field, idx) of fields" :key="idx" class="flex flex-row">
                <div class="w-1/5 text-orange-900 font-light">{{ field.label }}:&nbsp;</div>
                <div
                    class="w-4/5 text-gray-700 font-normal tracking-wide"
                    v-if="field.prop && field.prop.length"
                >
                    {{ field.prop }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { date, toBoolean } from "src/filters";
export default {
    props: {
        collection: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            showCollectionInformation: true,
            fields: [
                {
                    label: "DOI",
                    prop: `https://dx.doi.org/${
                        this.collection.identifier.filter((i) => i.name === "doi")[0].value
                    }`,
                },
                {
                    label: "Date Created",
                    prop: date(this.collection.dateCreated),
                },
                {
                    label: "Last Update",
                    prop: date(this.collection.dateModified),
                },
                {
                    label: "Comments",
                    prop: this.collection.comments,
                },
                {
                    label: "Deposit Form Received",
                    prop: toBoolean(this.collection.depositFormReceived),
                },
                {
                    label: "Media",
                    prop: this.collection.media,
                },
                {
                    label: "Orthographic Notes",
                    prop: this.collection.orthographicNotes,
                },
                {
                    label: "Private",
                    prop: toBoolean(this.collection.private),
                },
                {
                    label: "License",
                    prop: this.collection.license[0].name,
                },
            ],
        };
    },
};
</script>

<style lang="scss" scoped></style>
56F94A07C9003
