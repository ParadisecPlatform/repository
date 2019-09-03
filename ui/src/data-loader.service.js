"use strict";

export class DataLoader {
    constructor({ $router }) {
        this.base = "/repository";
        this.ocflRootDescriptor = "0=ocfl_1.0";
        this.$router = $router;
    }

    async verifyRepositoryMounted() {
        let response = await fetch(`${this.base}/${this.ocflRootDescriptor}`);
        if (response.status !== 200) {
            this.$router.push({ name: "RepositoryNotAvailable" });
        }
    }
}
1;
