"use strict";

import { uniqBy } from "lodash";

const numberOfAggregations = 5;

export class SearchService {
    constructor({ store }) {
        this.store = store;
        this.service = store.state.configuration.service.search;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
    }

    async applyFilter({ filter }) {
        filter.id = await this.createFilterIdentifier({ filter });

        let filters = [...this.store.state.search.filters];
        filters.push(filter);
        filters = uniqBy(filters, filter => `${filter.field}${filter.value}`);
        this.search({ filters, page: 0 });
    }

    async createFilterIdentifier({ filter }) {
        const encoder = new TextEncoder();
        const data = encoder.encode(`${filter.field}${filter.value}`);
        let id = await crypto.subtle.digest("SHA-512", data);
        id = Array.from(new Uint8Array(id));
        id = id.map(b => b.toString(16).padStart(2, "0")).join("");
        return id;
    }

    async removeFilter({ filter }) {
        filter.id = await this.createFilterIdentifier({ filter });

        let filters = [...this.store.state.search.filters];
        filters = filters.filter(f => f.id !== filter.id);
        this.search({ filters, page: 0 });
    }

    async negateFilter({ filter }) {
        filter.id = await this.createFilterIdentifier({ filter });

        let filters = [...this.store.state.search.filters];
        filters = filters.map(f => {
            if (f.id === filter.id) {
                filter = { ...filter, negate: !f.negate };
                return filter;
            } else {
                return f;
            }
        });
        this.search({ filters, page: 0 });
    }

    async clearAllFilters() {
        this.search({ filters: [], page: 0 });
    }

    async search({ filters, page }) {
        const pageSize = 10;
        if (!filters) filters = [...this.store.state.search.filters];
        let query = this.assembleQuery({ filters });
        // console.log(JSON.stringify(query, null, 2));
        let payload = { filters, query };
        this.store.commit("updateFiltersAndQuery", payload);
        // console.log(JSON.stringify(query, null, 2));
        let response = await this.execute({
            query: { query, from: page * pageSize, size: pageSize }
        });
        const total = response.hits.total.value;
        const documents = response.hits.hits;
        this.store.commit("updateQueryResults", { total, documents });
    }

    assembleQuery({ filters }) {
        let query = {
            bool: {
                must: [],
                must_not: []
            }
        };
        filters.forEach(filter => {
            let term;
            switch (filter.field) {
                case "domain":
                    term = constructDomainQuery({ filter });
                    break;
                case "contributor":
                    term = constructContributorQuery({ filter });
                    break;
                case "type":
                    term = constructTypeQuery({ filter });
                    break;
                case "publisher":
                    term = constructPublisherQuery({ filter });
                    break;
                case "contentType":
                    term = constructContentTypeQuery({ filter });
                    break;
                case "dateCreated":
                    term = constructDateQuery({ filter });
                case "dateModified":
                    term = constructDateQuery({ filter });
            }
            if (!filter.negate) query.bool.must.push(term);
            if (filter.negate) query.bool.must_not.push(term);
        });

        return query;

        function constructDomainQuery({ filter }) {
            return {
                nested: {
                    path: "identifier",
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        "identifier.name": "domain"
                                    }
                                },
                                {
                                    term: {
                                        "identifier.value": filter.value
                                    }
                                }
                            ]
                        }
                    }
                }
            };
        }

        function constructContributorQuery({ filter }) {
            return {
                nested: {
                    path: "contributor",
                    query: {
                        bool: {
                            must: [
                                {
                                    term: {
                                        "contributor.name": filter.value
                                    }
                                },
                                {
                                    term: {
                                        "contributor.role": filter.role
                                    }
                                }
                            ]
                        }
                    }
                }
            };
        }

        function constructTypeQuery({ filter }) {
            return {
                term: { additionalType: filter.value }
            };
        }

        function constructPublisherQuery({ filter }) {
            return {
                nested: {
                    path: "publisher",
                    query: {
                        term: { "publisher.name": filter.value }
                    }
                }
            };
        }

        function constructContentTypeQuery({ filter }) {
            return {
                nested: {
                    path: "hasPart",
                    query: {
                        term: { "hasPart.encodingFormat": filter.value }
                    }
                }
            };
        }

        function constructDateQuery({ filter }) {
            return {
                range: {
                    [filter.field]: {
                        gte: filter.dateRange.min,
                        lte: filter.dateRange.max
                    }
                }
            };
        }
    }

    async getStats() {
        let domains = await this.aggregateDomains({});
        let publishers = await this.aggregatePublishers({});
        let types = await this.aggregateTypes({});
        return { domains, publishers, types };
    }

    async getDateRange({ field = "dateCreated" }) {
        let query = {
            size: 0,
            aggs: {
                dateRange: {
                    stats: { field }
                }
            }
        };
        let filters = [...this.store.state.search.filters];
        let q = this.assembleQuery({ filters });
        query = {
            query: q,
            ...query
        };
        let response = await this.execute({ query });
        return {
            min: response.aggregations.dateRange.min_as_string,
            max: response.aggregations.dateRange.max_as_string
        };
    }

    async aggregateContentTypes({ size = numberOfAggregations }) {
        let query = {
            size: 0,
            aggs: {
                type: {
                    nested: {
                        path: "hasPart"
                    },
                    aggs: {
                        values: {
                            terms: {
                                field: "hasPart.encodingFormat",
                                size
                            }
                        }
                    }
                }
            }
        };
        let filters = [...this.store.state.search.filters];
        let q = this.assembleQuery({ filters });
        query = {
            query: q,
            ...query
        };
        let response = await this.execute({ query });
        let types = response.aggregations.type.values.buckets;
        return types;
    }

    async aggregateDomains({ size = numberOfAggregations }) {
        let query = {
            size: 0,
            aggs: {
                domains: {
                    nested: {
                        path: "identifier"
                    },
                    aggs: {
                        results: {
                            filter: {
                                term: {
                                    "identifier.name": "domain"
                                }
                            },
                            aggs: {
                                values: {
                                    terms: {
                                        field: "identifier.value",
                                        size
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        let filters = [...this.store.state.search.filters];
        let q = this.assembleQuery({ filters });
        query = {
            query: q,
            ...query
        };
        let response = await this.execute({ query });
        let domains = response.aggregations.domains.results.values.buckets;
        return domains;
    }

    async aggregateContributors({ size = numberOfAggregations }) {
        let query = {
            size: 0,
            aggs: {
                contributors: {
                    nested: {
                        path: "contributor"
                    },
                    aggs: {
                        roles: {
                            terms: {
                                field: "contributor.role",
                                size
                            },
                            aggs: {
                                names: {
                                    terms: {
                                        field: "contributor.name",
                                        size
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        let filters = [...this.store.state.search.filters];
        let q = this.assembleQuery({ filters });
        query = {
            query: q,
            ...query
        };
        let response = await this.execute({ query });
        let contributors = response.aggregations.contributors.roles.buckets.map(
            role => {
                return {
                    role: role.key,
                    names: role.names.buckets
                };
            }
        );
        return contributors;
    }

    async aggregatePublishers({ size = numberOfAggregations }) {
        let query = {
            size: 0,
            aggs: {
                publishers: {
                    nested: {
                        path: "publisher"
                    },
                    aggs: {
                        values: {
                            terms: {
                                field: "publisher.name",
                                size
                            }
                        }
                    }
                }
            }
        };
        let filters = [...this.store.state.search.filters];
        let q = this.assembleQuery({ filters });
        query = {
            query: q,
            ...query
        };
        let response = await this.execute({ query });
        let publishers = response.aggregations.publishers.values.buckets;
        return publishers;
    }

    async aggregateTypes({ size = numberOfAggregations }) {
        let query = {
            size: 0,
            aggs: {
                type: {
                    terms: {
                        field: "additionalType",
                        size
                    }
                }
            }
        };
        let filters = [...this.store.state.search.filters];
        let q = this.assembleQuery({ filters });
        query = {
            query: q,
            ...query
        };
        let response = await this.execute({ query });
        let types = response.aggregations.type.buckets;
        return types;
    }

    // async search({ text }) {
    //     let query = {
    //         query: {
    //             multi_match: {
    //                 query: text,
    //                 fields: ["name", "description"]
    //             }
    //         }
    //     };
    //     let response = await this.execute({ query });
    //     const total = response.hits.total.value;
    //     let documents = response.hits.hits.map(hit => {
    //         return {
    //             id: hit._source.identifier.filter(i => i.name === "id")[0]
    //                 .value,
    //             name: hit._source.name,
    //             type: hit._source["schema:additionalType"]
    //         };
    //     });
    //     return { documents, total };
    // }

    async execute({ query }) {
        // console.log(`${this.service}/_search`);
        // console.log(JSON.stringify(query, null, 2));
        let response = await fetch(`${this.service}/_search`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(query)
        });
        if (response.status !== 200) {
            console.log((await response.json()).error);
            // console.log(
            //     JSON.stringify((await response.json()).error.reason, null, 2)
            // );
            return {};
        }
        return await response.json();
    }
}
