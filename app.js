const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controllers.js')
const { getArticleById, patchArticle, getArticles } = require('./controllers/articles.controllers.js');

app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticle);
app.get('/api/articles', getArticles)

module.exports = app;