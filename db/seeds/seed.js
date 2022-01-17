/* You will need to create your tables and write your seed function to insert the data into your database.

In order to both create the tables and seed your data, you will need the connection to your database. You can find this in the provided `connection.js`.
 */

//separate tables for topics, articles, users and comments. 

/*     .then(() => {
      return db.query(`
      CREATE TABLE shops (
        shop_id SERIAL PRIMARY KEY,
        shop_name VARCHAR(255) NOT NULL,
        owner VARCHAR(100) NOT NULL,
        slogan VARCHAR(255)
      );`);
    }) */
const db = require('../connection');
const format = require('pg-format');
// double check what needs to be not null and length of allowed chars
const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // 1. create tables
  return db.query(`DROP TABLE IF EXISTS comments, articles, users, topics;`)
      .then(() => {
        return db.query(
          `CREATE TABLE topics (
             slug VARCHAR(50) PRIMARY KEY NOT NULL,
             description VARCHAR(150) NOT NULL
          );`
        )
      })
      .then(() => {
        return db.query(
          `CREATE TABLE users (
            username VARCHAR(30) PRIMARY KEY NOT NULL,
            avatar_url VARCHAR(2048), 
            name VARCHAR(50)
          );`
        )
      })
      .then(() => {
        return db.query(
          // `CREATE TABLE articles (
          //   article_id SERIAL PRIMARY KEY NOT NULL,
          //   title VARCHAR(100) NOT NULL,
          //   body VARCHAR(10000),
          //   votes 
          // )`
        )
      })
      // .then(() => {
      //   return db.query
      // })

  // 2. insert data
};

module.exports = seed;
