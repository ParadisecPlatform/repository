# Setting up for development

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

## UI Docker container dies after a while

You will find that after a while, the docker container running the webpack-development-server for the UI dies. In the console you'll see something like:

```
ui_1      | Aborted
ui_1      | npm ERR! code ELIFECYCLE
ui_1      | npm ERR! errno 134
ui_1      | npm ERR! modpdsc-ui@1.0.0 develop: `npm install --no-progress && node_modules/.bin/webpack-dev-server --config webpack.develop.js --hot --inline`
ui_1      | npm ERR! Exit status 134
ui_1      | npm ERR!
ui_1      | npm ERR! Failed at the modpdsc-ui@1.0.0 develop script.
ui_1      | npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
ui_1      |
ui_1      | npm ERR! A complete log of this run can be found in:
ui_1      | npm ERR!     /root/.npm/_logs/2020-01-20T05_58_05_373Z-debug.log
ui_1      | modpdsc_ui_1 exited with code 134
^CKilling modpdsc_search_1  ...
^[[A^CERROR: Aborting.
```

Just stop and restart the setup with:

```
> docker-compose stop && docker-compose rm -f && docker-compose up
```
