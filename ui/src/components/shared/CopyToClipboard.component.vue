<template>
    <div>
        <el-button
            @click="copyToClipboard"
            :type="setType === 'check' ? 'success' : 'primary'"
            size="mini"
        >
            <div v-show="setType === 'link'">
                <i class="fas fa-link"></i>
            </div>
            <div v-show="setType === 'copy'">
                <i class="fas fa-copy"></i>
            </div>
            <div v-show="setType === 'check'">
                <i class="fas fa-check"></i>
            </div>
        </el-button>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: String | undefined, required: true },
        type: {
            type: String,
            default: "link",
            validator: (val) => ["link", "copy"].includes(val),
        },
    },
    data() {
        return {
            link: "fas fa-link",
            copy: "far fa-copy",
            check: "fa fas-check",
            setType: this.type,
        };
    },
    methods: {
        copyToClipboard() {
            const el = document.createElement("textarea");
            el.value = this.data;
            el.setAttribute("readonly", "");
            el.style = { position: "absolute", left: "-9999px" };
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            this.setType = "check";
            setTimeout(() => {
                this.setType = this.type;
            }, 2000);
        },
    },
};
</script>
