<template>
    <div>
        <div v-if="languageData.length">
            <div class="text-sm">{{name}}</div>
            <div class="flex flex-row flex-wrap">
                <el-tag
                    v-for="(language, idx) of languageData"
                    :key="idx"
                    class="m-1"
                >{{language.name}} ({{language.alternateName}})</el-tag>
            </div>
        </div>
    </div>
</template>

<script>
import { isPlainObject, compact } from "lodash";
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        languages: {
            type: Array | Object,
            required: true
        }
    },
    data() {
        return {
            languageData: []
        };
    },
    mounted() {
        let languageData = isPlainObject(this.languages)
            ? [this.languages]
            : this.languages;
        if (languageData) {
            languageData = languageData.map(l => {
                if (l.name.length && l.alternateName.length)
                    return {
                        name: l.name,
                        alternateName: l.alternateName
                    };
            });
            this.languageData = compact(languageData);
        }
    }
};
</script>

<style lang="scss" scoped>
</style>