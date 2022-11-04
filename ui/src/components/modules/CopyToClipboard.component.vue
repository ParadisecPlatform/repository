<template>
    <div>
        <el-button
            @click="copyToClipboard"
            :type="data.setType === 'check' ? 'success' : 'primary'"
        >
            <div v-show="data.setType === 'link'">
                <i class="fas fa-link"></i>
            </div>
            <div v-show="data.setType === 'copy'">
                <i class="fas fa-copy"></i>
            </div>
            <div v-show="data.setType === 'check'">
                <i class="fas fa-check"></i>
            </div>
        </el-button>
    </div>
</template>

<script setup>
import { reactive } from "vue";
const props = defineProps({
    data: { type: String, required: true },
    type: {
        type: String,
        default: "link",
        validator: (val) => ["link", "copy"].includes(val),
    },
});
const data = reactive({
    link: "fas fa-link",
    copy: "far fa-copy",
    check: "fa fas-check",
    setType: props.type,
});
function copyToClipboard() {
    const el = document.createElement("textarea");
    el.value = props.data;
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    data.setType = "check";
    setTimeout(() => {
        data.setType = props.type;
    }, 2000);
}
</script>
