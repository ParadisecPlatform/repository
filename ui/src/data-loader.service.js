"use strict";

export class DataLoader {
    constructor({ $router }) {
        this.api =
            process.env.NODE_ENV === "development" ? "localhost:8000" : "/api";
        this.repository = "/repository";
        this.ocflRootDescriptor = "0=ocfl_1.0";
        this.$router = $router;
        this.configuration = {
            domain: "",
            service: {
                search: "http://localhost:8000/search",
                api: "http://localhost:8000"
            }
        };
    }

    async getConfiguration() {
        let response = await fetch(`/configuration.json`);
        let configuration = { ...this.configuration };
        if (response.status === 200) {
            configuration = await response.json();
            configuration = { ...this.configuration, ...configuration };
        }
        return configuration;
    }

    async verifyRepositoryMounted() {
        let response = await fetch(
            `${this.repository}/${this.ocflRootDescriptor}`
        );
        if (response.status !== 200) {
            console.log(
                "Error: the OCFL filesystem does not seem to be mounted."
            );
            // this.$router.push({ name: "RepositoryNotAvailable" });
        }
    }

    async verifyApiServiceAvailable(service) {
        try {
            let response = await fetch(`${service}/health-check`);
            if (response.status !== 200) {
                console.log("Error: the API does not seem to be available.");
                // this.$router.push({ name: "RepositoryNotAvailable" });
            }
        } catch (error) {
            console.log("Error: the API does not seem to be available.");
            // this.$router.push({ name: "RepositoryNotAvailable" });
        }
    }

    async verifySearchServiceAvailable({ service }) {
        try {
            let response = await fetch(service);
            if (response.status !== 200) {
                console.log(
                    "Error: the Search endpoint does not seem to be available."
                );
                // this.$router.push({ name: "RepositoryNotAvailable" });
            }
        } catch (error) {
            console.log(
                "Error: the Search endpoint does not seem to be available."
            );
            // this.$router.push({ name: "RepositoryNotAvailable" });
        }
    }
}
1;
