# R Packages Web App

## Installation

### First, start the back end

1. Install back end dependancies in `/app-be` by running `npm install`
2. Run `cp .env.sample .env` inside of `/app-be`
3. Set up Postgre SQL database. Get your URL in the following format `postgres://<user>:<pass>@<host>:<port>/<db-name>`. (Heroku offers free sandbox Postgre databases);
4. Open up `.env` and add your postgres URL to `POSTGRES_URI`.
5. Run `npm run boot` when running the server for the first time. It should take a while. It will say `App Listening on Port 3000` on a successful boot up.
6. Back end can be accessed from `http://localhost:3000/`

### Second, start the front end

1. Go to `./app-fe`
2. Run `npm install`
3. Run `npm run dev`
4. Front end is served from `http://localhost:8080/`

Once the back end us running on port 3000 and the front end is being served from port 8080, you can see the application at `http://localhost:8080`.

## Issues & Corners Cut

### General

1. There is no production version, build script, or dockerization.
2. PostgreSQL DB needs to be provisioned separately and is not part of a single build process.
3. TypeScript is only being used on the front end, not the back end as well. 
4. Ideally, the front end would be served as a bundle from a static folder via express. Unfortunately, there wasn't any time to create a webpack production build script. 

### Crawler

1. There are lots of edge cases surrounding Author names, such as separating each author with "and", or listing a URL after the Author's name. These have not been parsed.

2. Some RegEx's might not be commented on or explained

### Back End

1. IDs being used as parameters for the routes `/api/author/:id` and `/api/package/:id` in order to save time, which is not ideal if we want to have a RESTful API where data is more or less legible to the consumer of the API. Ideally, the implementations would have been: `/api/package/:name` and `/api/package/:name`, but would have taken a bit longer to handle potentially unsafe characters.

2. Routes declaration and route handlers have not been modularized. They've all been declared and written in `./app-be/index.js`;

3. There's an ugly implementation that handles populating the database before starting up the server with `app.listen()`:

    This is not ideal, but including `Sequelize.close()` in `./models/populate.js` attempts to close a connection to the database while it's querying, and `finally {}` or `.finally()` do not wait for async calls in either the `then`able or `try {}` block.

    So, the shortcut is to populate the database on server startup. Running `npm run boot` should crawl for the latest CRAN data, unpack each repo, and populate the database accordingly anyway.

    `app.listen` is then called inside of populateDatabase's then statement, assuming the data migration is successful.

4. Ideally, database migration and running the backend API server would be separate tasks in your build scripts. I was so knee-deep invested in using Sequelize's ORM that it was easier to tap into that to write to Postgres

5. ENV variables come from running `dotenv`. There is no "production" yet.

### Front End

1. The front end is currently served from running the webpack dev server. I did not have the time to work on a webpack production config .

2. There are a bunch of fetch actions for which there aren't any reducers for. 

3. Action functions and Reducer functions currently don't have interfaces describing them.

4. The `/views/PackageList.tsx` file uses `any` to describe `location` to save on time, 

5. Didn't get around to describing the interface for `GlobalState`. Currently, `any` is used to describe the global redux state right now which certainly defeats the purpose of TypeScript for Redux

6. Clicking `Version:` on `/package/:id` doesn't do anything. Ideally, there would be no button to click on, and I would have rendered it as pure text.

5. There might be some unused packages in `packages.json`
