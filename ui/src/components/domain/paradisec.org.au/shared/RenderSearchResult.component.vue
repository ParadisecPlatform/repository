<template>
    <div class="flex flex-col">
        <div class="text-xl">
            <span v-if="itemContent.type === 'collection'">
                <i class="fas fa-layer-group"></i>
                Collection
            </span>
            <span v-if="itemContent.type === 'item'">
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
            <div class="text-sm">
                {{ mashIdentifier(itemContent.identifier) }}
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
            itemContent: {
                description: {}
            },
            descriptionMaxLength: 200
        };
    },
    mounted() {
        let item = { ...this.item._source };
        this.itemContent = {
            type: item["schema:additionalType"],
            name: item.name,
            description: {
                text: item.description.slice(0, this.descriptionMaxLength),
                truncated:
                    item.description.length > this.descriptionMaxLength
                        ? true
                        : false
            },
            domain: item.identifier.filter(i => i.name === "domain")[0].value,
            identifier: item.identifier.filter(i => i.name === "id")[0].value
        };
    },
    methods: {
        mashIdentifier(identifier) {
            const domain = this.$store.state.configuration.domain;
            if (!identifier) return;
            if (domain) {
                identifier = identifier.replace(`/${domain}/`, "");
            }
            return `/view/${identifier}`;
        }
    }
};
</script>

<style lang="scss" scoped></style>
