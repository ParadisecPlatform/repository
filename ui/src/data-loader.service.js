"use strict";

export class DataLoader {
    constructor({ $router }) {
        this.api =
            process.env.NODE_ENV === "development" ? "localhost:8000" : "/api";
        this.repository = "/repository";
        this.ocflRootDescriptor = "0=ocfl_1.0";
        this.$router = $router;
    }

    async verifyRepositoryMounted() {
        let response = await fetch(
            `${this.repository}/${this.ocflRootDescriptor}`
        );
        if (response.status !== 200) {
            console.log(
                "Error: the OCFL filesystem does not seem to be mounted."
            );
            this.$router.push({ name: "RepositoryNotAvailable" });
        }
    }

    async verifyServicesAvailable() {
        try {
            let response = await fetch(`${this.api}/health-check`);
            if (response.status !== 200) {
                console.log("Error: the API does not seem to be available.");
                this.$router.push({ name: "RepositoryNotAvailable" });
            }
        } catch (error) {
            console.log("Error: the API does not seem to be available.");
            this.$router.push({ name: "RepositoryNotAvailable" });
            return;
        }

        try {
            response = await fetch(`${this.api}/search`);
            if (response.status !== 200) {
                console.log(
                    "Error: the Search endpoint does not seem to be available."
                );
                this.$router.push({ name: "RepositoryNotAvailable" });
            }
        } catch (error) {
            console.log(
                "Error: the Search endpoint does not seem to be available."
            );
            this.$router.push({ name: "RepositoryNotAvailable" });
        }
    }
}
1;
