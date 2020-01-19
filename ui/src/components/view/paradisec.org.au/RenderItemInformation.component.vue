<template>
    <div>
        <el-button
            type="text"
            @click="showItemInformation = !showItemInformation"
        >
            <span v-show="showItemInformation">hide</span>
            <span v-show="!showItemInformation">show</span>
            item information</el-button
        >
        <div class="flex flex-col" v-if="showItemInformation">
            <div
                v-for="(field, idx) of fields"
                :key="idx"
                class="flex flex-row"
            >
                <div class="text-orange-900 font-light">
                    {{ field.label }}: &nbsp;
                </div>
                <div
                    class="text-gray-700 font-hairline"
                    v-if="field.prop && field.prop.length"
                >
                    {{ field.prop }}
                </div>
            </div>

            <!-- contentLanguages -->
            <!-- subjectLanguages -->
        </div>
    </div>
</template>

<script>
import { date } from "src/filters";
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            showItemInformation: false,
            fields: [
                {
                    label: "Date Created",
                    prop: date(this.data.objectifiedCrate.dateCreated)
                },
                {
                    label: "Last Update",
                    prop: date(this.data.objectifiedCrate.dateModified)
                },
                {
                    label: "Born Digital",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/bornDigital"
                    ]
                },
                {
                    label: "Cite As",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/citeAs"
                    ]
                },
                {
                    label: "Dialect",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/dialect"
                    ]
                },
                {
                    label: "Digitised On",
                    prop: date(
                        this.data.objectifiedCrate[
                            "http://paradisec.org.au/digitisedOn"
                        ]
                    )
                },
                {
                    label: "Discourse Type",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/discourseType"
                    ]
                },
                {
                    label: "External",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/external"
                    ]
                },
                {
                    label: "Ingest Notes",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/ingestNotes"
                    ]
                },
                {
                    label: "Language As Given",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/languageAsGiven"
                    ]
                },
                {
                    label: "Originated On",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/originatedOn"
                    ]
                },
                {
                    label: "Originated On Narrative",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/originatedOnNarrative"
                    ]
                },
                {
                    label: "Private",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/private"
                    ]
                },
                {
                    label: "Received On",
                    prop: this.data.objectifiedCrate[
                        "http://paradisec.org.au/receivedOn"
                    ]
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped></style>
