<template>
    <div class="flex flex-col">
        <div class="text-lg">
            <span v-if="itemContent.type.includes('RepositoryCollection')">
                <i class="fas fa-layer-group"></i>
                Collection
            </span>
            <span v-if="itemContent.type.includes('RepositoryObject')">
                <i class="far fa-folder-open"></i>
                Item
            </span>
        </div>
        <router-link :to="{ path: mashIdentifier(itemContent.identifier) }">
            <div class="text-lg">{{ itemContent.name }}</div>
        </router-link>
        <div class="text-base">
            {{ itemContent.description.text }}
            <span v-if="itemContent.description.truncated">...</span>
        </div>
        <router-link :to="{ path: mashIdentifier(itemContent.identifier) }">
            <div class="text-sm">{{ mashIdentifier(itemContent.identifier) }}</div>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            descriptionMaxLength: 200,
        };
    },
    computed: {
        itemContent: function() {
            let item = { ...this.item };
            return {
                identifier: item._source.resource,
                type: item._source["@type"],
                name: item._source.name,
                description: {
                    text: item._source.description.slice(0, this.descriptionMaxLength),
                    truncated:
                        item._source.description.length > this.descriptionMaxLength ? true : false,
                },
                domain: item.domain,
            };
        },
    },
    mounted() {},
    methods: {
        mashIdentifier(identifier) {
            const domain = this.$store.state.configuration.domain;
            if (!identifier) return;
            if (domain) {
                identifier = identifier.replace(`/${domain}`, "/view");
            }
            return `${identifier}`;
        },
    },
};
</script>

<style lang="scss" scoped></style>
