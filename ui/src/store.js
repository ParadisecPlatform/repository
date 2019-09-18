"use strict";

import Vue from "vue";
import Vuex from "vuex";
import { flattenDeep } from "lodash";
Vue.use(Vuex);
import { DataLoader } from "src/services/data-loader.service";

const configuration = {
    strict: process.env.NODE_ENV !== "production",
    state: {
        configuration: {},
        status: {
            api: undefined,
            search: undefined,
            ocfl: undefined
        }
    },
    mutations: {
        saveApplicationConfiguration(state, configuration) {
            state.configuration = { ...configuration };
        },
        saveStatus(state, status) {
            state.status = { ...status };
        }
    },
    actions: {
        async initialise({ commit }) {
            const dataLoader = new DataLoader();
            const configuration = await dataLoader.getConfiguration();
            commit("saveApplicationConfiguration", configuration);
            let status = {
                api: undefined,
                search: undefined,
                ocfl: undefined
            };
            if (configuration.service.api) {
                status.api = await dataLoader.verifyApiServiceAvailable({
                    service: configuration.service.api
                });
            } else {
                status.ocfl = await dataLoader.verifyRepositoryMounted();
                status.search = await dataLoader.verifySearchServiceAvailable({
                    service: configuration.service.search
                });
            }
            commit("saveStatus", status);
        }
    },
    getters: {}
};
export const store = new Vuex.Store(configuration);
