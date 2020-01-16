# Modern PARADISEC Catalog

-   [Modern PARADISEC Catalog](#modern-paradisec-catalog)
    -   [Getting setup](#getting-setup)
    -   [Starting the development environment](#starting-the-development-environment)
    -   [Stopping the development environment](#stopping-the-development-environment)
    -   [Repository Structure](#repository-structure)
        -   [User Interface](#user-interface)
        -   [OCFL Tools](#ocfl-tools)
    -   [Data specific view components](#data-specific-view-components)
        -   [Adding a data specific renderer](#adding-a-data-specific-renderer)
        -   [Getting started with your own renderer](#getting-started-with-your-own-renderer)

How might Nabu work if backed by OCFL? Let's find out...

## Getting setup

-   `Docker containers and docker-compose` are used to run the development environment.
-   You will need an OCFL filesystem @ `$PWD/ocfl-repository` which will be mounted in to the UI container and available at `/repository`. An OCFL repository is not included with this code.

## Starting the development environment

```
> docker-compose up
```

Browse to `http://localhost:9001` to see the UI

## Stopping the development environment

```
> docker-compose stop && docker-compose rm -f
```

## Repository Structure

### User Interface

This is the User Interface (UI) code. The core technologies used to build the UI include:

-   VueJS: https://vuejs.org/v2/guide/
    -   the UI framework
-   Vue Router: https://router.vuejs.org/
    -   part of the framework
-   Vuex: https://vuex.vuejs.org/
    -   part of the framework
-   ElementUI: https://element.eleme.io/#/en-US/component/installation
    -   UI controls - things like buttons and cards and accordions and such
-   TailwindCSS: https://tailwindcss.com/docs/installation
    -   responsive CSS utilities - nice addition to the UI controls provided by ElementUI

`Webpack` is used to build the application and `webpack-development-server` provides the auto-reload capability in development.

### OCFL Tools

In order to index content for use with this application you will also need the OCFL tools @ git@github.com:CoEDL/ocfl-tools.git. Check them out and read the instructions there on what's available and to use it.

## Data specific view components

The UI has been designed to be extensible to various incoming data formats. Specifically, if a mapping is defined for a particular type of data that component will be used to render it. Otherwise, a simple
generic renderer will be used.

### Adding a data specific renderer

A renderer can be added as follows:

-   Create a folder named as the domain in `ui/src/components/view/`.
-   Create the component in that folder.
-   Add a mapping for that component in to `ui/src/components/view/renderers.js`. You can load a renderer based on the `domain` of the data or the `domain` and `additionalType`. Using PARADISEC as an example the domain is paradisec.org.au and the additionalType is one of item or collection.

When instantiated the component will be passed a data object with a signature as follows:

```
{
    additionalType,         # if defined - the type of the data
    dataTypes,              # the datatypes contained in this object (images, audio, video etc)
    datafiles,              # the datafiles in the OCFL object keyed on file name
    domain,                 # the domain of the data
    flattenedCrate,         # the flattenedCrate
    inventory,              # the OCFL inventory
    objectifiedCrate,       # the crate as an object
    path,                   # the path of the object relative to the root
    version,                # the current version of the ocflObject that has been loaded
    versions,               # all of the available versions
}
```

The signature of the component itself must be as follows:

```

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>

``
```

### Getting started with your own renderer

Check out `view/paradisec.org.au/ItemViewer.component.vue` as well as `view/paradisec.org.au/RenderContent.component.vue`.

## Configuring the application

The application configuration can be found in the file `ui/src/configuration.json`. In there you will find settings to control how the application is configured and what it will handle. Following is a detailed description of the available configuration:

-   domain: if you want to lock the application to a specific `domain` and have shorter URL's then define the domain here.
-   imageFormats, audioFormats, videoFormats: the media formats the application will try to display. Ensure that whatever you put here is supported by all browsers.
-   documentFileExtensions: These are the extensions supported by google document viewer. See: https://gist.github.com/tzmartin/1cf85dc3d975f94cfddc04bc0dd399be for more information.
-   transcriptionFileExtensions: You probably don't want to change this.
-   service: if search is defined and not API the application will expect the OCFL repository to be mounted at /srv/repository on the UI server and available at http:/{{domain}}/repository. Otherwise, if API is defined all requests will be sent to the API. <!-- TODO: not yet implemented   -->
