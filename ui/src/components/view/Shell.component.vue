<template>
    <div class="px-2">
        <el-tabs
            type="border-card"
            tab-position="top"
            v-model="data.activeTab"
            @tab-click="handleTabChange"
        >
            <el-tab-pane label="Metadata" name="metadata">
                <div v-if="data.activeTab === 'metadata'" v-loading="data.loading">
                    <describo-crate-builder
                        v-if="!data.error && !data.loading && data.expertMode"
                        :crate="data.crate"
                        :profile="data.profile"
                        :readonly="true"
                        @ready="ready"
                    />
                    <div v-if="data.error" class="bg-red-200 text-center p-2 font-light">
                        The metadata for that item is not able to be loaded.
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Content" name="content" v-if="data.type === 'item'">
                <render-content-component
                    :crate="data.crate"
                    v-if="data.activeTab === 'content' && !data.loading"
                />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import RenderContentComponent from "./RenderContent.component.vue";
import { useRoute, useRouter } from "vue-router";
import { getPath } from "../modules/content-viewer/lib.js";
import { inject, onMounted, onBeforeMount, reactive } from "vue";
import { CrateManager } from "../../crate-manager.js";
const $route = useRoute();
const $router = useRouter();
const $http = inject("$http");

let data = reactive({
    activeTab: "metadata",
    expertMode: true,
    loading: false,
    error: false,
    type: undefined,
    crate: {},
    profile: {},
});

onBeforeMount(() => {
    const { contentType } = $route.params;
    if (contentType) data.activeTab = "content";
    updateRoute({ tab: data.activeTab });
});
onMounted(() => {
    init();
});
async function init() {
    data.loading = true;
    data.error = false;
    const { collectionId, itemId } = $route.params;
    if (collectionId && !itemId) {
        data.type = "collection";
    } else if (collectionId && itemId) {
        data.type = "item";
    } else if (itemId && !collectionId) {
        data.type = "item";
    }

    let response = await $http.get({ route: `${getPath($route.params)}/metadata` });
    if (response.status === 200) {
        const { crate } = await response.json();
        let c = new CrateManager({ crate });
        const rootDatasetType = c.getRootDataset()["@type"].join(", ");

        response = await $http.get({ route: `/profiles/${rootDatasetType}` });
        if (response.status === 200) {
            const { profile } = await response.json();
            if (profile) {
                data.profile = { ...profile };
            }
        }
        data.crate = { ...crate };
        data.loading = false;
    } else {
        data.loading = false;
        data.error = true;
    }
}

async function handleTabChange(tab) {
    data.loading = true;
    updateRoute({ tab: tab.props.name });
    await new Promise((resolve) => setTimeout(resolve, 100));
    data.loading = false;
}

function updateRoute({ tab }) {
    const { collectionId, itemId } = $route.params;
    let path;
    if (tab === "metadata") {
        if (collectionId && !itemId) {
            path = `/collections/${collectionId}`;
        } else if (collectionId && itemId) {
            path = `/collections/${collectionId}/items/${itemId}`;
        } else if (itemId && !collectionId) {
            path = `/items/${itemId}`;
        }
        $router.push({ path });
    }
}

function ready() {
    data.loading = false;
}
</script>
