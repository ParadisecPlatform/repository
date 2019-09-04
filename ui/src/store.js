"use strict";

import Vue from "vue";
import Vuex from "vuex";
import { flattenDeep } from "lodash";
Vue.use(Vuex);
import { DataLoader } from "src/data-loader.service";

const configuration = {
    strict: process.env.NODE_ENV !== "production",
    state: {
        configuration: {}
    },
    mutations: {
        saveApplicationConfiguration(state, configuration) {
            state.configuration = { ...configuration };
        }
    },
    actions: {
        async initialise({ commit }, { $router }) {
            const dataLoader = new DataLoader({ $router: this.$router });
            const configuration = await dataLoader.getConfiguration();
            if (configuration.service.api) {
                await dataLoader.verifyApiServiceAvailable({
                    service: configuration.service.api
                });
            } else {
                await dataLoader.verifyRepositoryMounted();
                await dataLoader.verifySearchServiceAvailable({
                    service: configuration.service.search
                });
            }
        }
    },
    getters: {}
};
export const store = new Vuex.Store(configuration);
