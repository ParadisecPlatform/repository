import fsExtra from "fs-extra";
const { readJSON } = fsExtra;

const privateFields = ["clientSecret"];

export async function loadConfiguration() {
    let configuration =
        process.env.NODE_ENV === "development"
            ? "/srv/configuration/development-configuration.json"
            : "/srv/configuration.json";
    configuration = await readJSON(configuration);
    return configuration;
}

export function filterPrivateInformation({ configuration }) {
    let services = Object.keys(configuration.api.authentication).map((service) => {
        service = {
            ...configuration.api.authentication[service],
            name: service,
        };
        for (let privateField of privateFields) {
            delete service[privateField];
        }
        return service;
    });
    configuration.api.authentication = {};
    for (let service of services) {
        configuration.api.authentication[service.name] = service;
    }

    return configuration;
}
