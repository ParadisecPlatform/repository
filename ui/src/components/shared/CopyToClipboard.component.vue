<template>
    <div>
        <el-button @click="copyToClipboard" type="primary" size="mini"
            ><i class="fas fa-link"></i>
        </el-button>
    </div>
</template>

<script>
export default {
    props: {
        data: { type: String | undefined, required: true },
    },
    data() {
        return {};
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
        },
    },
};
</script>
