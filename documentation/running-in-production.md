# Running a production instance

- [Running a production instance](#running-a-production-instance)
  - [Setting up the containers](#setting-up-the-containers)
  - [OCFL Tools](#ocfl-tools)

## Setting up the containers
Prebuilt containers are available on docker hub @ https://hub.docker.com/repository/docker/coedl/ocfl-viewer.

You will need a suitable docker-compose file. An example to start from is at: [production compose example](../docker-compose-examples/example-docker-compose-production.yml). Note that you will need to revise the 
`${PATH TO}` placeholders in that file. Setting up the elastic configuration files is documented in the 
[elastic readme](../elastic/README.md).

## OCFL Tools

In order to index content for use with this application you will also need the OCFL tools @ [git@github.com:CoEDL/ocfl-tools.git](git@github.com:CoEDL/ocfl-tools.git). Check them out and read the instructions there on what's available and how to use them