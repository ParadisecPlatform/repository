<template>
    <div>
        <div class="my-2 text-xl">Recently Updated Content</div>

        <div class="flex flex-row flex-wrap justify-around">
            <div
                v-for="item of items"
                :key="item._id"
                @click="$router.push(item._source.resource)"
                class="w-1/2 lg:w-1/3 cursor-pointer"
            >
                <el-card class="m-2 hover:bg-orange-200">
                    <!-- <pre>{{ item._source }}</pre> -->
                    <div slot="header">{{ item._source.name }}</div>
                    <div v-if="item._source.description.length">
                        {{ trimDescription(item._source.description) }}
                    </div>
                    <!-- <div class="flex flex-row text-3xl text-orange-600">
                        <div v-if="item._source.contentTypes.images" class="mx-2">
                            <i class="far fa-file-image"></i>
                        </div>
                        <div v-if="item._source.contentTypes.audio" class="mx-2">
                            <i class="far fa-file-audio"></i>
                        </div>
                        <div v-if="item._source.contentTypes.video" class="mx-2">
                            <i class="far fa-file-video"></i>
                        </div>
                        <div v-if="item._source.contentTypes.documents" class="mx-2">
                            <i class="far fa-file-pdf"></i>
                        </div>
                        <div v-if="item._source.contentTypes.transcriptions" class="mx-2">
                            <i class="far fa-file-alt"></i>
                        </div>
                    </div> -->
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import { Query, BoolQuery } from "@coedl/elastic-query-builder";
import { termQuery, matchQuery } from "@coedl/elastic-query-builder/queries";
import { execute } from "components/shared/search-builder";

export default {
    data() {
        return {
            items: [],
            maxDescriptionLength: 300,
        };
    },
    mounted() {
        this.loadRecentlyUpdatedItems();
    },
    methods: {
        async loadRecentlyUpdatedItems() {
            let query = new Query({}).size(12).append(
                new BoolQuery().must(
                    new BoolQuery().should([
                        termQuery({
                            field: "@type.keyword",
                            value: "RepositoryObject",
                        }),
                        termQuery({
                            field: "@type.keyword",
                            value: "RepositoryCollection",
                        }),
                    ])
                )
            );
            query = query.toJSON();
            query.sort = [{ dateModified: "desc" }];
            // console.log(JSON.stringify(query, null, 2));
            let results = await execute({
                service: this.$store.state.configuration.service.search,
                index: this.$store.state.configuration.domain,
                query,
            });
            // console.log(JSON.stringify(results.documents, null, 2));
            this.items = [...results.documents];
        },
        trimDescription(description) {
            if (description.length > this.maxDescriptionLength)
                return `${description.slice(0, this.maxDescriptionLength)}...`;
            return description;
        },
    },
};
</script>

<style lang="scss" scoped></style>
