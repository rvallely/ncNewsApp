/* You will need to create your tables and write your seed function to insert the data into your database.

In order to both create the tables and seed your data, you will need the connection to your database. You can find this in the provided `connection.js`.
 */

//separate tables for topics, articles, users and comments. 
const db = require('../connection');
const format = require('pg-format');
const { formatTopicData, formatUserData, formatArticleData, formatCommentData } = require('./seed-formatting');

const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
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
            name VARCHAR(50) NOT NULL, 
            password VARCHAR(50) NOT NULL
          );`
        )
      })
      .then(() => {
        return db.query(
          `CREATE TABLE articles (
            article_id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            body VARCHAR(10000) NOT NULL,
            votes INTEGER DEFAULT 0,
            topic VARCHAR(50) REFERENCES topics(slug) NOT NULL,
            author VARCHAR(30) REFERENCES users(username) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
        )
      })
      .then(() => {
        return db.query(
          `CREATE TABLE comments (
            comment_id SERIAL PRIMARY KEY,
            author VARCHAR(30) REFERENCES users(username) NOT NULL,
            article_id INTEGER REFERENCES articles(article_id) NOT NULL, 
            votes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            body VARCHAR(1000) NOT NULL
          );`
        )
      })
      .then(() => {
        const formattedTopics = formatTopicData(topicData);
        const sql = format(
          `INSERT INTO topics
          (slug, description)       
          VALUES %L;`, formattedTopics
        );
        return db.query(sql);
      })
      .then(() => {
        const formattedUsers = formatUserData(userData);
        const sql = format(
          `INSERT INTO users
          (username, avatar_url, name, password)
          VALUES %L;`, formattedUsers
        );
        return db.query(sql);
      })
      .then(() => {
        const formattedArticles = formatArticleData(articleData);
        const sql = format(
          `INSERT INTO articles
          (title, body, votes, topic, author, created_at)
          VALUES %L;`, formattedArticles
        );
        return db.query(sql);
      })
      .then(() => {
        const formattedComments = formatCommentData(commentData);
        const sql = format(
          `INSERT INTO comments
          (author, article_id, votes, created_at, body)
          VALUES %L;`, formattedComments
        );
        return db.query(sql);
      });
};

module.exports = seed;
