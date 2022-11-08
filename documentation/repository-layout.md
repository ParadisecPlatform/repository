# Repository Layout

## Documentation

The document folder at `${ROOT}/documentation` contains detailed documentation on developing and
deploying this code.

## User Interface

The User Interface (UI) code is found in the folder `${ROOT}/ui`. The core technologies used to
build the UI include:

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

`Webpack` is used to build the application and `webpack-development-server` provides the auto-reload
capability in development.

## API

The api code is found in the folder `${ROOT}/api`.

## Elasticsearch configuration

The folder `${ROOT}/elastic` contains the configuration required to set up an elastic search
instance for development. You probably `shouldn't` change anything in this folder but you will need
to refer to the content when deploying an instance of this application in production.

Detailed information on the configuration files is found in the [README](../elastic/README.md) file.
