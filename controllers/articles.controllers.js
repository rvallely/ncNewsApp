const { selectArticleById, updateArticle, selectArticles, selectComments, removeArticle } = require('../models/articles.models.js'); //removeArticle
const { checkArticleIdExists, checkPatchKeys, checkColumnExists, checkTopicExists } = require('../utils/utils.js');

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    return checkArticleIdExists(article_id).then((articleExists) => {
        if (articleExists) {
            return selectArticleById(article_id).then((article) => {
                       res.status(200).send({ article: article })
                   });
        } else {
            return Promise.reject({ status: 404, msg: 'Not Found: this article does not exist.' })
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

exports.getArticles = (req, res, next) => {
    if(req.query.order === undefined || req.query.order === 'ASC' || req.query.order === 'DESC') {
        return checkTopicExists(req.query.topic).then((validityCheck) => {
            if (validityCheck === 'invalid topic') {
                return Promise.reject({ status: 404, msg: 'Not Found: topic does not exist'}).catch((err) => {
                next(err);
                });
            } else {
                const columnExists = checkColumnExists(req.query);
                if (columnExists) {
                    const query = req.query;
                    return selectArticles(query).then((articles) => {
                        res.status(200).send({ articles: articles })
                    });
                } else if (columnExists === false) {
                    return Promise.reject({ status: 404, msg: 'Not Found: this column does not exist'}).catch((err) => {
                        next(err);
                    });
                }
            }
        });
    } else {
        return Promise.reject({ status: 400, msg: 'Bad Request: order is invalid'}).catch((err) => {
            next(err);
            });
    }
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

exports.deleteArticle = (req, res, next) => {
    const article_id = req.params.article_id;
    return checkArticleIdExists(article_id).then((articleExists) => {
        if(articleExists) {
            removeArticle(article_id).then((article) => {
                res.status(204).send(article);
            })
        } else {
            return Promise.reject({ status: 404, msg: 'Not Found: this article does not exist.' });
        }
    })    
    .catch((err) => {
        next(err);
    });
}