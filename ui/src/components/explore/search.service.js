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
        let response = await this.execute({ query });
        let domains = response.aggregations.domains.results.values.buckets;
        return domains;
    }

    async getAuthors() {
        let query = {
            size: 0,
            aggs: {
                authors: {
                    nested: {
                        path: "author"
                    },
                    aggs: {
                        values: {
                            terms: {
                                field: "author.name"
                            }
                        }
                    }
                }
            }
        };
        let response = await this.execute({ query });
        let authors = response.aggregations.authors.values.buckets;
        return authors;
    }

    async getCollections() {
        let query = {
            query: {
                match: {
                    "schema:additionalType": "collection"
                }
            }
        };
        let response = await this.execute({ query });
        const total = response.hits.total.value;
        let results = response.hits.hits.map(hit => {
            return hit._source.identifier.filter(i => i.name === "id")[0].value;
        });
        return { results, total };
    }

    async searchCollections({ text }) {
        let query = {
            query: {
                multi_match: {
                    query: text,
                    fields: ["name", "description"]
                }
            }
        };
        let response = await this.execute({ query });
        const total = response.hits.total.value;
        let documents = response.hits.hits.map(hit => {
            return hit._source.identifier.filter(i => i.name === "id")[0].value;
        });
        return { documents, total };
    }

    async execute({ query }) {
        // console.log(`${this.service}/_search`);
        // console.log(JSON.stringify(query, null, 2));
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
