<template>
    <div>
        <div v-if="licenseDefined" class="text-sm">
            <div class="flex flex-row p-2 justify-center rounded" :class="type">
                <div class="leading-tight text-center">{{ data.name }}</div>
                <div v-if="type === 'bg-red-300' && data.description.length">
                    {{ data.description }}
                </div>
            </div>
        </div>
        <div v-else>
            <div class="flex flex-row rounded" :class="type">
                <span class="leading-tight text-center"
                    >No license seems to be defined for this item</span
                >
            </div>
        </div>
    </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            licenseDefined:
                isEmpty(this.data.name) && isEmpty(this.data.description) ? false : true,
        };
    },
    computed: {
        type: function() {
            try {
                return this.data.name.match(/^Open/) ? "bg-green-200" : "bg-red-300";
            } catch (error) {
                return "error";
            }
        },
    },
};
</script>
