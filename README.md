# SupraCoderCRUD
Z-prefix CRUD application built in 72 hours

This "Inventory Tracker" application is meant to satisfy the following user stories:
(screenshots of the app are provided below)

1) As an inventory manager I want to be able to create an account so that I can track my inventory.
2) As an inventory manager I want to be able to log into my account so that I can see my inventory of items.
	After logging in, the inventory manager should be redirected to their inventory of items.
3) As an inventory manager I want to be able to create a new item so that I can share my item details with the world.
	After the item is created, the inventory manager should be redirected to their inventory of items.
	An item displays name, description, and quantity.
4) As an inventory manager I want to be able to see a my entire inventory of items.
	The inventory of items should display the first 100 characters of each item description, with “...” at the end if the description is longer than 100 characters.
5) As an inventory manager I want to be able to see any individual item I have added.
	The full item information should be displayed.
6) As an inventory manager I want to be able to edit an item so that I can fix any mistakes I made creating it.
	When the user toggles edit mode, the page remains the same and the fields become editable.
7) As an inventory manager I want to be able to delete an item so that I can remove any unwanted content.
	When the user deletes the item they should be redirected to their inventory of items.
8) As a visitor, who is not logged in, I want to be able to view all items created by every inventory manager so that I can browse every item.
	Unauthenticated users should be able to view all items, and any single item.
	The items should only display the first 100 characters of its description with “...” at the end if it is longer than 100 characters.
9) As a visitor, who is not logged in, I want to be able to view a specific item created by any user so that I can see all of its details.
	Unauthenticated users should be able to view all items, and any single item.
10) As an inventory manager I want to be able to view all items created by every inventory manager so that I can browse every item.
	Unauthenticated users should be able to view all items, and any single item.

Notes: As this applications was built as a Minimal Viable Product (MVP), here a few notable mentions:
- Any user (inv manager) can GET, ADD, PATCH (edit), and DELETE any item.
- Any modifications made (save for DELETE), 'Last Modified by:' will be updated with user's firstname
  example
![lastModBy](https://github.com/user-attachments/assets/de35651b-a91e-4203-bd9a-dd1ae9d66bb4)
- Once an inventory manager creates (adds) a new item OR edits an item, the new/updated item will be displayed at the bottom of the inventory list (must scroll to the bottom).
- #4 remains a 'stretch goal'

------------------------------------Instructions on running the app:-----------------------------------------

1. Back-end (Database)
    - make sure Docker is running/ you are signed in
      
      Open your terminal for the following commands (you will have a least 3 terminals running to operate the app)
    - Pull down a Dockerized Postgres image from the cloud (if one is not already initiated);
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

- push migration & seeding files to DB (see steps 5) & 6) in 'Building Backend' below)
  
  (example)
  ![Db_items](https://github.com/user-attachments/assets/ef6ace23-5199-4ab5-b2bf-d0e41ffae337)
![DB_users](https://github.com/user-attachments/assets/095c51c6-7260-4647-8b60-7de32dfde113)


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

--------------------------Building Backend--------------------------------------
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
5) Migration files:
   In the terminal:
   	- npx knex migrate:make create_name_of_table
Migrate to DB:
	- npx knex migrate:latest
	- npx knex migrate:rollback (rollback anytime you need edit seeding files)
6) Seed Files:
   	- npx knex seed:make <name>
    run seed files in DB (push up 'dummy data')
	- npx knex seed:run
7) In database terminal, navigate to 'inventory_db' and select a table:
   	- SELECT * FROM users; (SQL language)
   	- SELECT * FROM items;
   your migration tables and content of your seed files should appear in the terminal:

![DB_tables](https://github.com/tiffystar/SupraCodersCRUD/assets/54339124/63219fc9-4925-4826-8873-050bcc9a4e3e)

8) Build your .route's in your app.js file (this is where your server will GET, POST, PATCH, DELETE items in the database)
9) Run PostMan queries to ensure you're able to Create, Read, Update, and Delete (CRUD)

    sample postman queries:
   
![POSTMAN_post](https://github.com/tiffystar/SupraCodersCRUD/assets/54339124/f2238301-c325-44af-bf2b-943635d2cc5b)

![POSTMAN_post2](https://github.com/tiffystar/SupraCodersCRUD/assets/54339124/fa982ef3-f0c1-45a5-8252-cc5cb1821891)

------------------Images of running app-------------------

HOME screen

![app_home](https://github.com/user-attachments/assets/11444d82-94c6-4f22-9c39-f61420e26771)

VISITORS (for non-users to view inventory items)

![visitorsView](https://github.com/user-attachments/assets/16d58984-5ba8-471e-87e0-bd1f4d368bf4)

CREATE ACCOUNT (new users)

![CreateAccount](https://github.com/user-attachments/assets/cf6adde7-966f-4bbe-a5c3-3924472bf225)


LOGIN (users with credentials)

![LoginPage](https://github.com/user-attachments/assets/3a22ad0b-a96c-4756-9196-859038998ed4)


InvManager (where users can add, edit, and delete items)

![InvManager](https://github.com/user-attachments/assets/d062a110-f3b1-4bf6-ada6-fd66e98bddc3)


SERVER (glimpse of the /users API data)

![serverUsers](https://github.com/user-attachments/assets/87c5179f-0bb1-430c-92bd-6e8e6a0319d3)

