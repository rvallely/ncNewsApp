const { selectArticleById, updateArticle, selectArticles, selectComments } = require('../models/articles.models.js');
const { checkArticleIdExists, checkPatchKeys } = require('../utils/utils.js');

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    return checkArticleIdExists(article_id).then((articleExists) => {
        if (articleExists) {
            return selectArticleById(article_id).then((article) => {
                       res.status(200).send({ article: article })
                   });
        } else {
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
    })
    .catch((err) => {
        next(err);
    });
}

exports.patchArticle = (req, res, next) => {
    const article_id = req.params.article_id;
    const patchObj = req.body;
    const hasInc_Votes = checkPatchKeys(patchObj)
    if (hasInc_Votes) {
        return checkArticleIdExists(article_id).then((articleExists) => {
            if (articleExists) {
                const increaseVotesBy = req.body.inc_votes;
                updateArticle(article_id, increaseVotesBy).then((updatedArticle) => {
                res.status(200).send({ updatedArticle: updatedArticle });
                });
            } else {
                return Promise.reject({ status: 404, msg: 'Not Found' })
            }
        })
        .catch((err) => {
            next(err);
        });
    } else {
        return Promise.reject({ status: 400, msg: 'Bad Request: missing field(s) or incorrect data type' }).catch((err) => {
            next(err);
        })
    }
}
// NEED TO FINSIH GET ARTICLES WITH COMMENT COUNT 
exports.getArticles = (req, res, next) => {
    selectArticles().then((articles) => {
        res.status(200).send({ articles: articles })
    });
}

exports.getCommentsForArticleId = (req, res, next) => {
    const article_id = req.params.article_id
    return checkArticleIdExists(article_id).then((articleExists) => {
        if (articleExists) {
            selectComments(article_id).then((comments) => {
                res.status(200).send({ comments : comments });
            });
        } else {
            return Promise.reject({ status: 404, msg: 'Not Found' })
        }
    })
    .catch((err) => {
        next(err);
    });
}