# Travel Authorization

## General Stack

### API

- [Node](https://nodejs.org/en) + [Express](https://expressjs.com/)

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)

- [Knex](https://knexjs.org/guide/)

### FrontEnd

- [Vue2](https://v2.vuejs.org/) + [Vuetify](https://vuetifyjs.com/en/getting-started/installation/)

- [Axios](https://github.com/axios/axios)

### DB

- Postgres DB - [psql](https://www.postgresql.org/docs/current/app-psql.html) (Switching this to MySQL)

- [Docker Compose](https://docs.docker.com/compose/compose-file/)

---

## Development

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

### API Service (a.k.a back-end)

1. In the `src/api` folder.

2. Create a `.env.development` file with this content. I must match the config in `docker-compose.db.yml`

   ```bash
   AUTH0_DOMAIN=https://dev-0tc6bn14.eu.auth0.com

   DB_HOST="localhost"
   DB_PORT="5432"
   DB_USER="user"
   DB_PASS="itsallgood"
   DB_NAME="travel"
   ```

3. Install the project using `npm install`

4. Start the application via `npm start`

5. Access the api, by logging in to the front-end, then going to http://localhost:3000

### Web Service (a.k.a. front-end)

1. In the `src/web` folder.

2. Install the project using `npm install`

3. Start the application via `npm start`

4. Log in to the front-end service at http://localhost:8080

## dbpostgres Service (a.k.a database or db)

1. Boot the database using
    ```bash
    docker compose -f docker-compose.db.yml up
    # Or
    docker-compose -f docker-compose.db.yml up
    ```

2. Once you have the `api` service running, and have logged in to the front-end, you can run the migrations by going to http://localhost:3000/migrate/latest

3. You can run the seeds by going to http://localhost:3000/seed

4. You can access the `psql` command line via

    ```bash
    docker compose -f docker-compose.db.yml exec dbpostgres psql postgresql://user:itsallgood@localhost:5432/travel
    ```

---

# Deploying (Production)

(Work in progres)
