const { selectArticleById, updateArticle, selectArticles } = require('../models/articles.models.js');

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    selectArticleById(article_id).then((article) => {
        res.status(200).send({ article: article })
    });
}

exports.patchArticle = (req, res, next) => {
    const article_id = req.params.article_id;
    const increaseVotesBy = req.body.inc_votes;
    updateArticle(article_id, increaseVotesBy).then((updatedArticle) => {
        res.status(200).send({ updatedArticle: updatedArticle });
    });
}

exports.getArticles = (req, res, next) => {
    console.log('in get art controller')
    selectArticles().then((articles) => {
        res.status(200).send({ articles: articles })
    });
}