# NC News

## Introduction

This repository is the backend of my NC News project.  
  
  More details on the project can be found in the README.md of the frontend repository: https://github.com/rvallely/nc-news. 

This repository:  
. creates, structures and seeds the database  
. builds the endpoints  
. has appropriate error handling and test suites

I wanted to bring together everything I had learned on the back-end section of the Northcoders bootcamp and develop my skills further. My main aim was to build strong and well tested endpoints and get comfortable writing code using the 'Model, View, Controller' pattern.

The hosted API of this back-end project: https://rosie-nc-news-app.herokuapp.com/api. 

Using the endpoints and the 'queries' and 'params' listed for each endpoint on the hosted API, you can change the URL and access data in the database.  
  
  To parse the data and make it more readable, you may want to download a JSON formatting extension for your browser such as: https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa.

## What I Learned

I found that planning ahead was really important. In particular, before beginning to build the database it was vital to think through how the data would be structured and how the data sets would relate to each other. For example, while working on the frontend of this project, I came back to this repository to add a password to each user and had to restructure the users table to do so. It would have been easier if I had thought about this and implemented it at an earlier stage.

I have learned that I enjoy the process of testing, because it helps form a fuller picture of what I am building and a framework of how an application will work under the hood. This was really useful when I moved on to the frontend of NC News. 

Testing provided an effective structure, keeping me focussed on one endpoint at a time, and one test at a time, always building out from the simplest test cases first.

## Special Note

I enjoyed using bcrypt to hash the passwords because security is an area I've always been interested in. Being able to successfully hash passwords in this project as an extra feature and understand more of how passwords are kept secure was really satisfying.

## Technology

The backend was written in PSQL and JavaScript.  
  
  Minimum requirements:  
. `Node.js v16.14.0`  
. `postgres (PostgreSQL) 14.2`  

## Setup

### Forking and Cloning 

1. Fork this repository.
2. From the forked repository, click the blue Code button and copy the HTTPS address to your clipboard. 
3. From your command line navigate to an appropriate location and run `git clone <copied-HTTPS-address-of-repo-here>`. This will clone the project to your machine so it can be run locally.
3. Open the project on your machine and from the command line run `npm install` to install dependencies.

### .env files

You will need to create _two_ `.env` files:  
. `.env.test`  
. `.env.development`

Into each, add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names and `.env-example` for an example). 

Double check that these `.env` files are .gitignored.

### Scripts, Seeding and Running Tests

In the `db` folder there is some data, a [setup.sql](./db/setup.sql) file and a `seeds` folder. This will all be used to run the project locally.

In the scripts section of the `package.json` file, there are some npm scripts available. It would be useful to familiarise yourself with these.
  
  For example, from the command line:  
  . `npm run seed` would seed the devData in `data/development-data`  
  . `npm test` would run the tests in `__tests__` folder using Jest
