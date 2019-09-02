# Modern PDSC

- [Modern PDSC](#modern-pdsc)
  - [Getting setup](#getting-setup)
  - [Starting the development environment](#starting-the-development-environment)
  - [Stopping the development environment](#stopping-the-development-environment)
  - [Repository Structure](#repository-structure)
    - [User Interface](#user-interface)

How might Nabu work if backed by OCFL? Let's find out...

## Getting setup

-   `Docker containers and docker-compose` are used to run the development environment so if you don't have them then install them now.
-   You will need an OCFL filesystem @ `$PWD/ocfl-repository` which will be mounted in to the UI container and available at `/repository`. An OCFL repository is not included with this code.

## Starting the development environment

```
> docker-compose up
```

Browse to `http://localhost:9000` to see the UI

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
    -   responsive CSS utilities - nice addition to the UI controls provided by ElementUIi

`Webpack` is used to build the application and `webpack-development-server` provides the auto-reload capability in development.
