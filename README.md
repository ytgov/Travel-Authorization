# Travel Authorization

## General Stack

### API (Back-end)

- [Node](https://nodejs.org/en) + [Express](https://expressjs.com/)

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

- [Knex](https://knexjs.org/guide/)

### Front-End

- [Vue2](https://v2.vuejs.org/) + [Vuetify](https://vuetifyjs.com/en/getting-started/installation/)

- [Axios](https://github.com/axios/axios)

### Database

- Postgres DB - [psql](https://www.postgresql.org/docs/current/app-psql.html)

- [Docker Compose](https://docs.docker.com/compose/compose-file/)

---

## Development

1. In the `api` folder.

2. Create a `.env.development` file with this content. It must match the config in `docker-compose.db.yml`

   ```bash
   AUTH0_DOMAIN=https://dev-0tc6bn14.eu.auth0.com
   AUTH0_AUDIENCE=testing

   DB_HOST="localhost"
   DB_PORT="5432"
   DB_USER="user"
   DB_PASS="itsallgood"
   DB_NAME="travel"
   ```

3. Go back to the top level directory.

4. [Set up the `dev`](./README.md#set-up-dev-command) command, or use `docker compose -f docker-compose.development.yml` instead of `dev` in all instructions.

5. Boot the api and db services via `dev up` or `docker compose -f docker-compose.development.yml up`

6. The seeds do not, yet, run automatically. You must run them via logging in to the front-end, then going to http://localhost:3000/migrate/seed.

6. Stop the api and db services via `ctrl+c` or `dev down` or if you want to wipe the database `dev down -v`.

### API Service (a.k.a back-end)

1. Boot only the api service using:

   ```bash
   dev up api

   # or

   docker compose -f docker-compose.development.yml up api
   ```

2. Access the api by logging in to the front-end, then going to http://localhost:3000

### Web Service (a.k.a. front-end)

> This has not yet been dockerized, you must install Node and some other stuff.

1. Install `asdf` as seen in https://asdf-vm.com/guide/getting-started.html.

   e.g. for Linux

   ```bash
   apt install curl git

   git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.12.0

   echo '
   # asdf
   . "$HOME/.asdf/asdf.sh"
   . "$HOME/.asdf/completions/asdf.bash"
   ' >> ~/.bashrc
   ```

2. Install the `nodejs` plugin via and the appropriate nodejs version.

   ```bash
   asdf plugin add nodejs

   # install the version from the .tool-verions file
   asdf install nodejs
   ```

   Check that you have the correct version set up by seeing that these two commands match:

   ```bash
   asdf current nodejs
   node -v
   ```

3. In the `web` folder.

4. Install the web dependecies using `npm install`

5. Start the web service via `npm start`

   > If you have the `dev` command you can also boot via `dev up_web` from the root directory.

6. Log in to the front-end service at http://localhost:8080

### DB Service (a.k.a database service)

1. Boot only the db service using:

   ```bash
   dev up db

   # or

   docker compose -f docker-compose.development.yml up db
   ```

   > Migrations run automatically, seeds do not, yet.

2. You can run the seeds by going to http://localhost:3000/migrate/seed

3. You can access the `psql` command line via

   ```bash
   dev psql

   # or

   docker compose -f docker-compose.development.yml exec db psql "postgresql://user:itsallgood@localhost:5432/travel"
   ```

### Troubleshooting

If you are getting a bunch of "Login required" errors in the console, make sure that you have disabled any kind of enhanced tracking protection.

Auth0 use third-party cookies for authentication, and they get blocked by all major browsers
by default.

## Migrations

You can generate migrations via the api service code. Currently uses [knex Migration CLI](https://knexjs.org/guide/migrations.html#migration-cli) using `dev knex ...` or `cd api && npm run knex ...`.

### Create a New Migration

```bash
dev knex migrate:make migration_name
```

This will generate a migration of the form:

- `api/src/data/migrations/20231013235256_migration_name.ts`

FUTURE: Implement dash cased migration names and/or switch to `umzug/Sequelize`

### Running Migrations

```bash
dev knex migrate:latest
dev knex migrate:up
```

### Rolling Migrations Backwards

```bash
dev knex migrate:rollback
dev knex migrate:rollback --all
dev knex migrate:down
```

## Set up `dev` command

The `dev` command vastly simplifies development using docker compose. It only requires `ruby`; however, `direnv` and `asdf` will make it easier to use.

It's simply a wrapper around docker compose with the ability to quickly add custom helpers.

All commands are just strings joined together, so it's easy to add new commmands. `dev` prints out each command that it runs, so that you can run the command manually to debug it, or just so you learn some docker compose syntax as you go.

1. (optional) Install `asdf` as seen in https://asdf-vm.com/guide/getting-started.html.

   e.g. for Linux

   ```bash
   apt install curl git

   git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.12.0

   echo '
   # asdf
   . "$HOME/.asdf/asdf.sh"
   . "$HOME/.asdf/completions/asdf.bash"
   ' >> ~/.bashrc
   ```

2. Install `ruby` via `asdf` as seen here https://github.com/asdf-vm/asdf-ruby, or using whatever custom Ruby install method works for your platform.

   e.g. for Linux

   ```bash
   asdf plugin add ruby https://github.com/asdf-vm/asdf-ruby.git

   # install version from .tool-versions file
   asdf install ruby

   asdf reshim ruby
   ```

   You will now be able to run the `./bin/dev` command.

3. (optional) Install [direnv](https://direnv.net/) and create an `.envrc` with

   ```bash
    #!/usr/bin/env bash

    PATH_add bin
   ```

   and then run `direnv allow`.

   You will now be able to do `dev xxx` instead ov `./bin/dev xxx`.

# Deploying

## Test Production Build Locally

Files:

- [Dockerfile](./Dockerfile)
- [docker-compose.yml](./docker-compose.yml)
- Various non-commited `api/.env.*` files

1. Create a `.env.development` and `.env.production` file in the `api/` directory with the appropriate values.

   - [ ] TODO: investigate if custom environment variables are needed

   This file must have the same variables as are used in the `docker-compose.yml` file.

   ```bash
   DB_HOST="db"
   DB_PORT="5432"
   DB_USER="user"
   DB_PASS="itsallgood"
   DB_NAME="travel"
   ```

   > TODO: keep all environment variables in a shared location.

2. Duplicate the `.env.production` file to `.env` in the top level directory.

3. TODO: figutre out the relevant environment variables to support login

4. Build and boot the production image via

   ```bash
   HOST_PORT=3000 docker compose up --build
   ```

5. Go to http://localhost:3000/ and log in.

6. Run the seeds via http://localhost:3000/migrate/seed.

7. Navigate around the app and do some stuff and see if it works.
