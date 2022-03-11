const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controllers.js')
const { getArticleById, patchArticle, getArticles, getCommentsForArticleId } = require('./controllers/articles.controllers.js');
const { postComment, getComments, deleteComment, getComment, patchComment } = require('./controllers/comments.controllers.js');
const { getUsers, getSingleUser } = require('./controllers/users.controllers.js');
const { handle404s, handleCustomErrors, handleServerErrors, handlePsqlErrors } = require('./errors/errors');
const endpoints = require('./endpoints');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticle);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsForArticleId);

app.post('/api/articles/:article_id/comments', postComment)
app.get('/api/comments', getComments);
app.delete('/api/comments/:comment_id', deleteComment);
app.get('/api/comments/:comment_id', getComment);
app.patch('/api/comments/:comment_id', patchComment);

app.get('/api/users', getUsers);
app.get('/api/users/:username', getSingleUser);

app.get('/api', (req, res, next) => {
    res.send(endpoints);
});

app.all('*', handle404s);

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);
app.use(handle404s);

module.exports = app;