const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controllers.js')
const { getArticleById, patchArticle, getArticles, deleteArticle, getCommentsForArticleId, postArticle } = require('./controllers/articles.controllers.js');
const { postComment, getComments, deleteComment, getComment, patchComment } = require('./controllers/comments.controllers.js');
const { getUsers, getSingleUser, postNewUser } = require('./controllers/users.controllers.js');
const { handle404s, handleCustomErrors, handleServerErrors, handlePsqlErrors } = require('./errors/errors');
const endpoints = require('./endpoints');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticle);
app.patch('/api/articles/remove/:article_id', deleteArticle);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsForArticleId);

app.post('/api/articles/:article_id/comments', postComment)
app.get('/api/comments', getComments);
app.delete('/api/comments/:comment_id', deleteComment);
app.get('/api/comments/:comment_id', getComment);
app.patch('/api/comments/:comment_id', patchComment);
app.post('/api/articles/', postArticle);

app.get('/api/users', getUsers);
app.post('/api/users/login', getSingleUser);
app.post('/api/users/signup', postNewUser);

app.get('/api', (req, res, next) => {
    res.send(endpoints);
});

app.all('*', handle404s);

app.use(handleCustomErrors);
app.use(handle404s);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;