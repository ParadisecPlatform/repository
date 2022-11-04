"use strict";

export async function execute({ service, index, query }) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    index = index ? `${service}/${index}/_search` : `${service}/${index}`;
    let response = await fetch(index, {
        method: "POST",
        headers,
        body: JSON.stringify(query),
    });
    if (response.status !== 200) {
        console.log((await response.json()).error);
        return {};
    }
    response = await response.json();
    const total = response.hits.total.value;
    const aggregations = response.aggregations;
    const documents = response.hits.hits;
    return { total, documents, aggregations };
}
