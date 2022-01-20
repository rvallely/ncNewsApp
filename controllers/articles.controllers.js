const { selectArticleById, updateArticle, selectArticles, selectComments } = require('../models/articles.models.js');
const { checkArticleIdExists } = require('../utils/utils.js');

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    console.log('line 6 article controller')
    // check article_id exists
    return checkArticleIdExists(article_id).then((articleExists) => {
        if (articleExists) {
            // if article exists then go and get the article
            return selectArticleById(article_id).then((article) => {
                       res.status(200).send({ article: article })
                   })
        } else {
            // else if an article doesn't exist throw a custom error
            console.log('in promise reject ')
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
    })
    .catch((err) => {
        console.log('in article controller catch')
        next(err);
    });
}

exports.patchArticle = (req, res, next) => {
    const article_id = req.params.article_id;
    const increaseVotesBy = req.body.inc_votes;
    updateArticle(article_id, increaseVotesBy).then((updatedArticle) => {
        res.status(200).send({ updatedArticle: updatedArticle });
    });
}
// NEED TO FINSIH GET ARTICLES WITH COMMENT COUNT 
exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        console.log(articles, '<<< back in controller')
        res.status(200).send({ articles: articles })
    });
}

exports.getCommentsForArticleId = (req, res, next) => {
    const article_id = req.params.article_id
    selectComments(article_id).then((comments) => {
        res.status(200).send({ comments : comments });
    });
}