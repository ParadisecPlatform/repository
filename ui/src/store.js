"use strict";

import Vue from "vue";
import Vuex from "vuex";
import { flattenDeep } from "lodash";
Vue.use(Vuex);

const configuration = {
    strict: process.env.NODE_ENV !== "production",
    state: {
        items: [],
        filters: [],
        selectedFilter: undefined
    },
    mutations: {
        reset(state) {
            state = {
                items: [],
                filters: [],
                selectedFilter: []
            };
        },
        setItems(state, items) {
            state.items = [...items];
        },
        setFilters(state, filters) {
            state.filters = [...filters];
        },
        setSelectedFilter(state, selectedFilter) {
            state.selectedFilter = selectedFilter;
        }
    },
    getters: {
        itemsFlattened: state => {
            return flattenDeep(
                state.items.map(item => {
                    let components = [];
                    if (item.images.length) {
                        components.push({
                            ...item.images[0],
                            images: item.images
                        });
                    }
                    return [...components, ...item.audio, ...item.video];
                })
            );
        },
        item: state => ({ collectionId, itemId }) => {
            return state.items.filter(item => {
                return (
                    item.collectionId === collectionId && item.itemId === itemId
                );
            })[0];
        }
    }
};
export const store = new Vuex.Store(configuration);
