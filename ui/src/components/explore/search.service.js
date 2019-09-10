"use strict";

export class SearchService {
    constructor({ service }) {
        this.service = service;
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
    }

    async getDomains() {
        let query = {
            size: 0,
            aggs: {
                // type: {
                //     terms: {
                //         field: "schema:additionalType"
                //     }
                // }
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
                                        field: "identifier.value"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        // let query = {
        //     size: 0,
        //     aggs: {
        //         domains: {
        //             nested: {
        //                 path: "identifier"
        //             },
        //             aggs: {
        //                 domains: {
        //                     field: "identifier.value"
        //                 }
        //             }
        //         }
        //     }
        // };
        let response = await this.execute({ query });
        let domains = response.aggregations.domains.results.values.buckets;
        return domains;
    }

    async execute({ query }) {
        console.log(`${this.service}/_search`);
        console.log(JSON.stringify(query, null, 2));
        let response = await fetch(`${this.service}/_search`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(query)
        });
        if (response.status !== 200) {
            console.log(
                JSON.stringify((await response.json()).error.reason, null, 2)
            );
            return {};
        }
        return await response.json();
    }
}
