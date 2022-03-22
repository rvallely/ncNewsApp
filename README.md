# NC News

## Introduction

NC News is a web application with the aim of creating a small scale and engaging news site. Users connect through posting short articles about things that interest them, and other users can comment on and like these articles. 

The aim of NC News is to create a hub for users to post short news articles and viewpoints about the things that matter to and interest them. The app is smaller in scale than usual news sites and is more focussed on connecting and empowering users, rather than necessarily the content they may be connecting over. I see it as more analogous to a friendly discord server, where the users help craft their own site/experience. More detail than a tweets on Twitter, but more personal than BBC News.

I chose to build a news and social app, because I am interested in the news and how we communicate information. I have consumed a lot of news and social media in various forms over the last few years, so I had a bit of prior experience in the area.

This repo is the backend of my NC News project. It created, structured and seeded the original database, builds endpoints, and has appropriate error handling and tests. I wanted to consolidate/bring together what I had learned on the backend section of the Northcoders bootcamp and test my skills. My main aim was to build strong and well tested endpoints and get comfortable writing code using the 'Model, View, Controller' pattern.

The hosted version of the project is here https://rosie-nc-news-app.herokuapp.com/api . 

Using the endpoints listed you can change the url and access data on the database. You will need to download an extension to parse the data and make it more inviting to read.

## What I learned

I learned that planning ahead and thinking through how data would be structured and how the data sets would relate to each other was vital. Later on in the project I came back to add a password to each user and had to restructure the users table to do so. I also learned I really enjoy testing, because it helped bring together what I was building in a larger way in terms of how parts would work together. Testing and error handling helped form a framework of how the app would work under the hood, which was really helpful when I moved on to the frontend part of the project. In terms of testing it was also helpful because it kept me focussed on one endpoint at a time, and always building with the simplest test case. I didn't get too distracted this way and way more efficient. How much time is saved through test and proper error handling. 

## Technology

It was built uing PSQL and JavaScript. 
Minimum Node.js is v16.14.0
postgres (PostgreSQL) 14.2
***** if use encryption need to include tech here

## Setup

### Forking and Cloning 

1. Fork this repository.
2. From the forked repository, press code and copy the HTTPS address to your clipboard. Then from your terminal or command line, run `git clone <link-to-copied-HTTPS-address-of-forked-repo-here>`. This will clone the project so it can be run locally.
3. From the command line of the project run `npm install` to install necessary dependencies.

### Seeding the database

Write your README, including the following information:
 Link to hosted version -- DONE
 Write a summary of what the project is -- DONE
 Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
 Include information about how to create the two .env files
 Specify minimum versions of Node.js and Postgres needed to run the project
Remember that this README is targetted at people who will come to your repo (potentially from your CV or portfolio website) and want to see what you have created, and try it out for themselves(not just to look at your code!). So it is really important to include a link to the hosted version, as well as implement the above GET /api endpoint so that it is clear what your api does.

## .env files

You will need to create _two_ `.env` files for the project: 
`.env.test` and  
`.env.development`.  

Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names) and see `.env-example` for an example. 

Double check that these `.env` files are .gitignored.

## Scripts, Seeding and Running Tests

In the `db` folder there is some data, a [setup.sql](./db/setup.sql) file and a `seeds` folder. This will all be used to run the project locally.

In the scripts section of the `package.json file`, there are some npm scripts available.

For example, from the command line `npm run seed` would seed the devData in `data/development-data` and `npm test` would run the tests in `__tests__` folder using Jest.

