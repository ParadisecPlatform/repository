"use strict";

import { createStore } from "vuex";
import { cloneDeep } from "lodash";

const mutations = {
    saveConfiguration(state, configuration) {
        state.configuration = { ...configuration };
    },
    updateFiltersAndQuery(state, payload) {
        state.search.filters = [...payload.filters];
        state.search.query = { ...payload.query };
    },
    updateQueryResults(state, payload) {
        state.search.results = { ...payload };
    },
};

const actions = {};
const getters = {
    getConfiguration(state) {
        return cloneDeep(state.configuration);
    },
};

export const store = new createStore({
    state: resetState(),
    mutations,
    getters,
    actions,
    modules: {},
});

function resetState() {
    return {
        configuration: {},
        status: {
            api: undefined,
            search: undefined,
            ocfl: undefined,
        },
        search: {
            filters: [],
            query: {},
            results: [],
        },
    };
}
