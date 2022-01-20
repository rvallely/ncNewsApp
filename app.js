const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controllers.js')
const { getArticleById, patchArticle, getArticles, getCommentsForArticleId } = require('./controllers/articles.controllers.js');
const { postComment, getComments, deleteComment, getComment } = require('./controllers/comments.controllers.js');
const { getEndpoints } = require('./controllers/endpoints.controllers.js');
//const {handlePsqlErrors, handleServerErrors, handleCustomErrors, handle404s } = require('./errors.erros.js');
const { handle404s, handleCustomErrors } = require('./errors/errors');

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
app.get('/api', getEndpoints);

app.all('*', handle404s);
// catch all - will match any method that hasn't been matched yet with any path that hasn't been matched yet and send out 404

//app.use(handlePsqlErrors);
//app.use(handleServerErrors);
app.use(handleCustomErrors);
app.use(handle404s);

module.exports = app;