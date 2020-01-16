<template>
    <div>
        <div v-if="error">The item is currently unavailable.</div>
        <div v-if="componentFile">
            <div class="flex flex-row text-sm">
                <version-selection-component
                    :selected-version="ocflObject.version"
                    :versions="[...ocflObject.versions].reverse()"
                    v-on:load-version="update"
                />
            </div>
            <component v-bind:is="componentFile" :data="ocflObject"></component>
        </div>
    </div>
</template>

<script>
import { DataLoader } from "src/services/data-loader.service";
const dataLoader = new DataLoader();

import VersionSelectionComponent from "./VersionSelection.component.vue";

import renderers from "./renderers";
export default {
    components: {
        VersionSelectionComponent
    },
    data() {
        return {
            itemIdentifier: null,
            ocflObject: {},
            viewComponent: undefined,
            error: false,
            errorMsg: undefined
        };
    },
    async mounted() {
        this.loadViewer({});
    },
    watch: {
        "$route.params": function(n, o) {
            if (n.pathMatch !== o.pathMatch) this.loadViewer({});
        }
    },
    computed: {
        componentFile: function() {
            if (!this.viewComponent) return;
            return () => import(`${this.viewComponent}`);
        },
        configuration: function() {
            return this.$store.state.configuration;
        }
    },
    methods: {
        async loadViewer({ version }) {
            this.viewComponent = undefined;
            this.$nextTick(async () => {
                let identifier;
                if (this.configuration.domain) {
                    identifier = `/${this.configuration.domain}${this.$route.params.pathMatch}`;
                } else {
                    identifier = this.$route.params.pathMatch;
                }
                console.debug(`Loading: ${identifier}: ${version}`);
                try {
                    let params;
                    if (version) {
                        params = {
                            identifier,
                            version,
                            configuration: this.$store.state.configuration
                        };
                    } else {
                        params = {
                            identifier,
                            configuration: this.$store.state.configuration
                        };
                    }
                    this.ocflObject = await dataLoader.load({ ...params });
                } catch (error) {
                    this.error = true;
                    this.errorMsg = error;
                    return;
                }
                let { domain, additionalType } = this.ocflObject;

                let viewComponent;
                if (
                    domain &&
                    additionalType &&
                    renderers[domain] &&
                    renderers[domain][additionalType]
                ) {
                    viewComponent = renderers[domain][additionalType];
                } else if (domain && renderers[domain]) {
                    viewComponent = renderers[domain];
                } else {
                    viewComponent = "./GenericViewer.component.vue";
                }
                this.viewComponent = viewComponent;
            });
        },
        update(v) {
            this.loadViewer({ version: v.version });
        }
    }
};
</script>

<style lang="scss" scope></style>
