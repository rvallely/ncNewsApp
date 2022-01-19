const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controllers.js')
const { getArticleById, patchArticle, getArticles, getCommentsForArticleId } = require('./controllers/articles.controllers.js');
const { postComment, getComments } = require('./controllers/comments.controllers.js');

app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticle);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsForArticleId);
app.post('/api/articles/:article_id/comments', postComment)
app.get('/api/comments', getComments);

module.exports = app;