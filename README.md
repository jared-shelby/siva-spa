# SIVA :: Single Page Application

## Overview
SIVA is a single-page web application built using a Ruby on Rails API backend with a HTML/CSS/Javascript frontend. SIVA enables users to elegantly manage their finances. 

## Features
- Create & track savings goals
- Analyze & categorize transactions

## Try it out
To try SIVA on your local machine:
- Clone this repo
- Install `Ruby 2.7.4`
- Run `bundle install`
- Run `rails db:create` to create the database (run `rails db:drop` if you already have a PostgresQL database locally)
- Run `rails db:migrate` to run the migrations & create the database schema
- Run `rails db:seed` to seed the database with test data (optional, but highly encouraged)
- Run `rails server` to start the local server (the Ruby on Rails API backend is officially ready to be queried)
- Open `frontend/index.html` in a browser window (the Javascript frontend is officially ready to query the API backend)

## How it works
Creating, migrating, and seeding sets up a local database for persistent storage. Spinning up the `rails server` allows HTTP requests to target `localhost:3000`. This means that requests can be sent to `localhost:3000` to alter the database that was just created. The `index.html` file in the `frontend` folder has multiple Javascript scripts linked. These scripts make `fetch` requests to `localhost:3000`. Thus, given the localhost server is running (from `rails server`), this `index.html` page will be able to make alterations to the database that was recently created. Altogether, this means that the user only needs to interact with `index.html` in order to use the full range of features SIVA offers. Each user's actions will be saved and updated on the database via fetch requests in Javascript.