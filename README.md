# NC News

## Introduction

This repository is the backend of my NC News project. More detail the NC News project can be found in the README.md of the frontend repository here https://github.com/rvallely/nc-news. It creates, structures and seeds the database, builds endpoints, and has appropriate error handling and test suites. I wanted to bring together everything I had learned on the backend section of the Northcoders bootcamp and begin to implement/develop my skills. My main aim was to build strong and well tested endpoints and get comfortable writing code using the 'Model, View, Controller' pattern.

The hosted version of this backend project is here https://rosie-nc-news-app.herokuapp.com/api . 

Using the endpoints and the queries and params listed for each endpoint, you can change the URL and access data on the database. You will need to download an extension such as 'JSON formatter' `https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa` to parse the data and make it more readable.

## What I learned

I found that planning ahead was really important. In particular, thinking through how data would be structured and how the data sets would relate to each other was vital, before beginning to build the database. Later on in the project, I came back to add a password to each user and had to restructure the users table to do so. 

I have learned that I enjoy testing, because it helps form a clearer picture in my head of what I am building and helps me understand how parts of a project would and wouldn't work together. Testing and error handling formed a framework of how the app would work under the hood, which was really helpful when I moved on to the frontend part of the project. I found testing useful also, because it kept me focussed on one endpoint at a time, and always building with the simplest test case. I didn't get too distracted this way and way more efficient. How much time is saved through test and proper error handling. 

## Technology

It was built uing PSQL and JavaScript. 
Minimum Node.js is v16.14.0
postgres (PostgreSQL) 14.2
***** if use encryption need to include tech here

## Setup

### Forking and Cloning 

1. Fork this repository.
2. From the forked repository, press code and copy the HTTPS address to your clipboard. Then from your terminal or command line, run `git clone <copied-HTTPS-address-of-forked-repo-here>`. This will clone the project so it can be run locally.
3. From the command line of the project run `npm install` to install necessary dependencies.

### .env files

You will need to create _two_ `.env` files for the project: 
`.env.test` and  
`.env.development`.  

Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names) and see `.env-example` for an example. 

Double check that these `.env` files are .gitignored.

### Scripts, Seeding and Running Tests

In the `db` folder there is some data, a [setup.sql](./db/setup.sql) file and a `seeds` folder. This will all be used to run the project locally.

In the scripts section of the `package.json file`, there are some npm scripts available. For example, from the command line `npm run seed` would seed the devData in `data/development-data` and `npm test` would run the tests in `__tests__` folder using Jest.


Write your README, including the following information:
 Link to hosted version -- DONE
 Write a summary of what the project is -- DONE
 Provide clear instructions of how to clone, install dependencies, seed local database, and run tests
 Include information about how to create the two .env files  -- DONE
 Specify minimum versions of Node.js and Postgres needed to run the project -- DONE
Remember that this README is targetted at people who will come to your repo (potentially from your CV or portfolio website) and want to see what you have created, and try it out for themselves(not just to look at your code!). So it is really important to include a link to the hosted version, as well as implement the above GET /api endpoint so that it is clear what your api does.