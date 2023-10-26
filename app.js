const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controllers.js')
const { patchArticle, getArticles, deleteArticle, postArticle } = require('./controllers/articles.controllers.js');
const { postComment, getComments, deleteComment, getComment, patchComment, getCommentsByArticleId } = require('./controllers/comments.controllers.js');
const { getSingleUser, postUser } = require('./controllers/users.controllers.js');
const { handle404s, handleCustomErrors, handleServerErrors, handlePsqlErrors } = require('./errors/errors');
const endpoints = require('./endpoints');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/api/users', getSingleUser);
app.post('/api/users', postUser);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.patch('/api/articles/:id', patchArticle);
app.post('/api/articles/', postArticle);

app.get('/api/comments', getComments);
app.patch('/api/comments/:id', patchComment);
app.get('/api/articles/:articleId/comments', getCommentsByArticleId);
app.post('/api/articles/:articleId/comments', postComment)










app.patch('/api/articles/remove/:id', deleteArticle);
app.delete('/api/comments/:id', deleteComment);
app.get('/api/comments/:id', getComment);



app.get('/api', (req, res, next) => {
    res.send(endpoints);
});

app.all('*', handle404s);

app.use(handleCustomErrors);
app.use(handle404s);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;