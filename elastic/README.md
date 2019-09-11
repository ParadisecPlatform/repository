# Elastic search superuser

- [Elastic search superuser](#elastic-search-superuser)
  - [elasticsearch.yml](#elasticsearchyml)
  - [roles.yml](#rolesyml)
  - [users](#users)
  - [users_roles](#usersroles)

This folder containst the configuration required to start an elastic search service in a sensible mode. As it's mapped out to the host directly we want to limit `anonymous` access to `read` permissions only. We also want an `indexer` user that we can use to load the index with.

## elasticsearch.yml

This is where we define an `anonymous` user mapped to the role `anonymous` which has read permission only.

## roles.yml

This is where we define the `anonymous` role which is permitted to read all indicies and view index metadata.

## users

This is where we define the `indexer` user that the `ocfl-indexer` uses to load data. The password is hashed using `bcrypt` but the easiest way to generate a new user and password is probably to do it within elastic search using the command `/usr/share/elasticsearch/bin/elasticsearch-users`.    

The credentials set up in this file are:
```
> username: indexer
> password: somerandompassword
```

## users_roles

This is where we map the `indexer` user to the `superuser` role.