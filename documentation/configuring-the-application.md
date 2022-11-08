# Configuring the application

-   [Configuring the application](#configuring-the-application)
    -   [Configuration options](#configuration-options)
    -   [domain](#domain)
    -   [Data Formats](#data-formats)
        -   [imageFormats, audioFormats, videoFormats](#imageformats-audioformats-videoformats)
        -   [documentFileExtensions](#documentfileextensions)
        -   [transcriptionFileExtensions](#transcriptionfileextensions)
    -   [service.search and service.api](#servicesearch-and-serviceapi)
    -   [Indexer Metadata Namespace](#indexer-metadata-namespace)
    -   [introduction, explore, header, footer](#introduction-explore-header-footer)
    -   [renderers](#renderers)

The application takes a single configuration file which defines how it will behave. A simple generic
configuration file can be seen at `configuration/generic-configuration.json`.

In development, copy `configuration/generic-configuration.json` to
`configuration/development-configuration.json` and edit as required.

In production, copy the generic config to `configuration/configuration.json` and edit as required.
