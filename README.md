# modpdsc

- [modpdsc](#modpdsc)
  - [Setup](#setup)
  - [Starting the development environment](#starting-the-development-environment)
  - [Stopping the development environment](#stopping-the-development-environment)
  - [Repository Structure](#repository-structure)
    - [User Interface](#user-interface)

How might Nabu work if backed by OCFL? Let's find out...

## Setup

-   `Docker containers and docker-compose` are used to run the development environment so if you don't have them install them now.
-   You will need an OCFL filesystem @ `$PWD/ocfl-repository` which will be mounted in to the UI container and available at `/repository`. An OCFL repository is not included with this code.

## Starting the development environment

```
> docker-compose up
```

## Stopping the development environment

```
> docker-compose stop && docker-compose rm -f
```

## Repository Structure

### User Interface

This is the User Interface (UI) code. The core technologies used to build the UI include:

-   VueJS: https://vuejs.org/v2/guide/
-   Vue Router: https://router.vuejs.org/
-   Vuex: https://vuex.vuejs.org/
-   ElementUI: https://element.eleme.io/#/en-US/component/installation
-   TailwindCSS: https://tailwindcss.com/docs/installation

Webpack is used to build the application and in development, webpack-development-server provides the auto-reload capability.
