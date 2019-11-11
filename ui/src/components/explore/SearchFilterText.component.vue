<template>
    <div class="inline">
        <span v-if="type === 'not'">NOT -</span>
        <span
            v-if="['schema:dateCreated', 'schema:dateModified'].includes(data.field)"
        >{{data.field}}: {{formatDate(data.dateRange.min)}} - {{formatDate(data.dateRange.max)}}</span>
        <span v-else>
            {{data.field}}: {{data.value}}
            <span v-if="data.role">({{data.role}})</span>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String
        },
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