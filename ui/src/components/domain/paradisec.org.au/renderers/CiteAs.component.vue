<template>
    <div>
        <div class="text-sm">
            Cite As
        </div>
        <div class="flex flex-row space-x-2">
            <div class="ml-2 p-2 bg-blue-100 border border-blue-400 rounded">{{ citation }}</div>
            <copy-to-clipboard-component :data="citation" type="copy" />
        </div>
    </div>
</template>

<script>
import CopyToClipboardComponent from "components/shared/CopyToClipboard.component.vue";
export default {
    components: {
        CopyToClipboardComponent,
    },
    props: {
        type: {
            type: String,
            validator: (val) => ["Item", "Collection"].includes(val),
            default: "collection",
        },
        id: {
            type: String,
            required: true,
        },
        contributors: {
            type: Array,
            required: true,
        },
        originatedOn: {
            type: String,
        },
        title: {
            type: String,
            required: true,
        },
        doi: {
            type: String,
            required: true,
        },
    },
    data() {
        return {};
    },
    computed: {
        contributorList() {
            return this.contributors
                .map(
                    (c) =>
                        `${c.givenName} ${c.familyName} (${c.role.map((r) => r.name).join(", ")})`
                )
                .join(", ");
        },
        citation() {
            let originatedOn = this.originatedOn ? `, ${this.originatedOn.split("-")[0]}.` : ".";
            return `${this.contributorList}${originatedOn} ${this.title}. ${this.type} ${this.id} in the PARADISEC Collection, paradisec.org.au. https://dx.doi.org/${this.doi}.`;
        },
    },
};
</script>
