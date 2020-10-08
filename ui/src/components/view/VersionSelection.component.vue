<template>
    <div class="flex flex-row flex-wrap">
        <div class="leading-loose mx-2">
            Versions:
        </div>
        <div
            @click="loadVersion(v)"
            class="cursor-pointer bg-gray-400 mx-1 px-2 py-1 rounded style-version-selector"
            v-for="(v, idx) of versions"
            :key="idx"
            :class="{
                'bg-highlight opacity-200': v.version === selectedVersion,
            }"
        >
            {{ v.version }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        selectedVersion: {
            type: String,
            required: true,
        },
        versions: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {};
    },
    methods: {
        loadVersion(version) {
            this.$emit("load-version", version);
        },
    },
};
</script>
