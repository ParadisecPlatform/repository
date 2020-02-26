<template>
    <div class="flex flex-col">
        <div class="text-base">{{ item.segment.text }}</div>
        <router-link
            :to="{ path: constructIdentifier({ segment: item.segment }) }"
        >
            <div class="text-xs">
                {{ constructIdentifier({ segment: item.segment }) }}
            </div>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            descriptionMaxLength: 200
        };
    },
    methods: {
        constructIdentifier({ segment }) {
            const domain = this.$store.state.configuration.domain;
            let identifier = segment.identifier;
            if (domain) {
                identifier = identifier.replace(`/${domain}/`, "/view/");
            }
            identifier = `${identifier}?transcription=${segment.file}&begin=${segment.timeBegin}&end=${segment.timeEnd}`;
            return identifier;
        }
    }
};
</script>

<style lang="scss" scoped></style>
