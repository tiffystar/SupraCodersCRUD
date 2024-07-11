# SupraCoderCRUD
Z-prefix CRUD application built in 72 hours

-------------------------------------------Instructions on running the app:----------------------------------------------------

1. Back-end (Database)
    - make sure Docker is running/ you are signed in
    Open your terminal for the following commands (you will have a least 3 terminals running to operate the app)
    - you may need to pull down a Dockerized Postgres image from the cloud (if one is not already initiated);
        run [docker images -a] to verify;
        otherwise, run [docker pull postgress]
    - Create the directories that will house your database data:
	    [mkdir -p $HOME/docker/volumes/postgres]
    - Start up a Docker Postgres container instance of the image that you pulled:
        [docker run --rm --name pg-docker -e POSTGRES_PASSWORD=docker -d -p 5432:5432 \-v $HOME/docker/volumes/postgres:/var/lib/postgresql/data postgres]
    - List all Docker images that are currently running:
        [docker ps -a]
    - Switch to the Docker image's shell with the container id you see from running the above in your terminal:
	    [docker exec -it <PSQL-Container-ID> bash]
    - Log in to the psql (Postgres) shell with the default postgres user:
	    [psql -U postgres]
    - See a list of databases:
	    [\list]
    - Navigate to a database:
	    [\c  <database_name>]
    - (to create database):
	    [CREATE DATABASE <name_db>]
    - Once inside DB, show list of tables:
	    [\dt]
![InitializeDB](https://github.com/tiffystar/SupraCodersCRUD/assets/54339124/a07b01f8-7f24-44e0-8537-5d303e7bf145)

2. Back End (Server)
    - open a second terminal
    - cd into main directory 'SupraCodersCRUD'
    - [npm start] to initialize browser (node /server.js)
    - will open on port 8080
    - (type 'control' + 'c' to close)

3. Front End
    - open a third terminal 
    - cd into 'front-end' and initialize the browser [npm start]
    - will open on port 3000
    - (type 'control' + 'c' to close)

4. (Optional)
    - if making edits, open a 4th terminal and be sure to 'push' up any changes to your forked/cloned github repo.

--------------------------Building Database--------------------------------------
1) Install necessary packages:
- npm install
- npm init -y
2) Install the following:
	- a web server: Express
	- a database client for your database management system ( DBMS ): Postgres
	- a query and schema builder, Knex.js
[npm i express pg knex]
3) Initialize KNEX: [npx knex init] -- generates a "Knexfile template" at the root of your project
   in the knexfile.js, ensure 'development' has the following content (replace 'books_db' with 'inventory_db'):
   ![KNEXfile](https://github.com/tiffystar/SupraCodersCRUD/assets/54339124/a19a984b-6ecb-4401-b7bb-5521e64b9800)

4) FOLLOW THE STEPS ABOVE FOR 'Back-end (Database)' to initialize your docker container.
5) Build you Migration files:
   In the terminal:
   	- npx knex migrate:make create_name_of_table
Migrate to DB:
	- npx knex migrate:latest
	- npx knex migrate:rollback (rollback anytime you need edit seeding files)
6) Build your Seed Files:
   	- npx knex seed:make <name>
    run seed files in DB (push up 'dummy data')
	- npx knex seed:run
7) In database terminal, navigate to 'inventory_db' and select a table:
   	- SELECT * FROM users; (SQL language)
   	- SELECT * FROM items;
   your migration tables and content of your seed files should appear in the terminal:
![DB_tables](https://github.com/tiffystar/SupraCodersCRUD/assets/54339124/63219fc9-4925-4826-8873-050bcc9a4e3e)
