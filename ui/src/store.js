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
    setUserData(state, payload) {
        state.user = { ...payload };
    },
};

const actions = {};
const getters = {
    getConfiguration(state) {
        return cloneDeep(state.configuration);
    },
    getUser(state) {
        return cloneDeep(state.user);
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
        user: {},
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
