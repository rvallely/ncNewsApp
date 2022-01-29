const { selectArticleById, updateArticle, selectArticles, selectComments } = require('../models/articles.models.js');
const { checkArticleIdExists, checkPatchKeys, checkColumnExists, checkTopicExists } = require('../utils/utils.js');

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id;
    return checkArticleIdExists(article_id).then((articleExists) => {
        console.log(articleExists, '<<< articles exist?')
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

exports.getArticles = (req, res, next) => {
    console.log(req.query.order, 'query');
    console.log(req.query.order===undefined);
    if(req.query.order === undefined || req.query.order === 'ASC' || req.query.order === 'DESC') {
        console.log('on line 50')
        console.log('on line 55')
        return checkTopicExists(req.query.topic).then((validityCheck) => {
            console.log(validityCheck, 'result validity check')
            if (validityCheck === 'invalid topic') {
                return Promise.reject({ status: 404, msg: 'Not Found: topic does not exist'}).catch((err) => {
                console.log(err, '<<< error here')
                next(err);
                });
            } else {
                const columnExists = checkColumnExists(req.query);
                console.log(columnExists, '<<< that column exists')
                if (columnExists) {
                    const query = req.query;
                    return selectArticles(query).then((articles) => {
                        res.status(200).send({ articles: articles })
                    });
                } else if (columnExists === false) {
                    console.log('column doesn\'t exist')
                    return Promise.reject({ status: 404, msg: 'Not Found: this column does not exist'}).catch((err) => {
                        console.log(err, '<<< error here')
                        next(err);
                    });
                }
            }
        });
    } else {
        return Promise.reject({ status: 400, msg: 'Bad Request: order is invalid'}).catch((err) => {
            console.log(err, '<<< error here')
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