<template>
    <div>
        <div v-if="error">The item is currently unavailable.</div>
        <div v-if="componentFile" class="flex flex-col">
            <data-display-component :data="ocflObject" />
            <div class="flex flex-row text-sm">
                <version-selection-component
                    :selected-version="ocflObject.version"
                    :versions="[...ocflObject.versions].reverse()"
                    v-on:load-version="update"
                />
                <div class="flex-grow"></div>
            </div>
            <div class="border-b border-black pb-2"></div>
            <component v-bind:is="componentFile" :data="ocflObject"></component>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
import { flattenDeep } from "lodash";
const dataLoader = new DataLoader();

import VersionSelectionComponent from "./VersionSelection.component.vue";
import DataDisplayComponent from "../shared/DataDisplay.component.vue";

export default {
    components: {
        VersionSelectionComponent,
        DataDisplayComponent,
    },
    data() {
        return {
            itemIdentifier: null,
            ocflObject: {},
            viewComponent: undefined,
            error: false,
            errorMsg: undefined,
        };
    },
    async mounted() {
        this.loadViewer({});
    },
    watch: {
        "$route.params": function (n, o) {
            if (n.pathMatch !== o.pathMatch) this.loadViewer({});
        },
    },
    computed: {
        componentFile: function () {
            if (!this.viewComponent) return;
            return () => import(`src/components/domain/${this.viewComponent}`);
        },
        configuration: function () {
            return this.$store.state.configuration;
        },
    },
    methods: {
        async loadViewer({ version }) {
            this.viewComponent = undefined;
            let identifier;

            // determine what to load based on the URL path
            if (this.configuration.domain) {
                identifier = `/${this.configuration.domain}${this.$route.params.pathMatch}`;
            } else {
                identifier = this.$route.params.pathMatch;
            }

            // try to load the object directly from OCFL
            //  not yet implemented: call to API if config says there is one
            console.debug(`Loading: ${identifier}: ${version}`);
            try {
                let params;
                if (version || this.$route.query.version) {
                    params = {
                        identifier,
                        version: version || this.$route.query.version,
                        configuration: this.$store.state.configuration,
                    };
                } else {
                    params = {
                        identifier,
                        configuration: this.$store.state.configuration,
                    };
                }
                this.ocflObject = await dataLoader.load({ ...params });
            } catch (error) {
                console.log(error);
                this.error = true;
                this.errorMsg = error;
                return;
            }

            //  set the version in the URL if not already defined
            if (!this.$route.query.version || this.$route.query.version !== this.ocflObject.version)
                this.$router.replace({
                    path: this.$route.path,
                    query: {
                        version: this.ocflObject.version,
                        ...this.$route.query,
                    },
                });

            // determine which renderer to load by
            //   - iterate over the renderers in the configuration using the last (most specific) that matches
            let viewComponent;
            const renderers = this.configuration.renderers;
            const { domain, type } = this.ocflObject;

            if (domain && renderers[domain]) {
                try {
                    let renderer = type.map((t) => renderers[domain].filter((r) => r.type === t));
                    renderer = flattenDeep(renderer).pop();
                    viewComponent = renderer.component;
                    console.log(`Loading ${viewComponent} to render the data`);
                } catch (error) {
                    console.error(
                        `Something went wrong trying to find a renderer for ${domain} ${type}`
                    );
                }
            } else {
                viewComponent = "./GenericViewer.component.vue";
            }
            this.viewComponent = viewComponent;
        },
        update(v) {
            this.loadViewer({ version: v.version });
        },
    },
};
</script>

<style lang="scss" scope></style>
