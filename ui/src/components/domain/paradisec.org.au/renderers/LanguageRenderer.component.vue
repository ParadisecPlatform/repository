<template>
    <div>
        <div v-if="languageData && languageData.length">
            <div class="text-sm">
                {{name}}
                <el-button
                    type="text"
                    @click="toggleLanguageData"
                    v-if="languages.length > maxLanguagesToShow"
                >
                    <span v-show="showAll">
                        <i class="fas fa-chevron-up"></i>
                    </span>
                    <span v-show="!showAll">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                </el-button>
            </div>
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
            showAll: false,
            maxLanguagesToShow: 10
        };
    },
    computed: {
        languageData: function() {
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
                languageData = this.showAll
                    ? [...languageData]
                    : [...languageData.slice(0, this.maxLanguagesToShow)];
                return compact(languageData);
            }
        }
    },
    mounted() {},
    methods: {
        toggleLanguageData() {
            this.showAll = !this.showAll;
        }
    }
};
</script>

<style lang="scss" scoped>
</style>