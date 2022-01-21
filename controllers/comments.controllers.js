const { insertComment, selectComments, removeComment, selectComment } = require('../models/comments.models.js');
const { checkArticleIdExists, checkCommentKeys, checkCommentExists } = require('../utils/utils.js');

exports.postComment = (req, res, next) => {
    const article_id = req.params.article_id;
    const newComment = req.body;
    if (newComment)
    console.log(Object.keys(req.body), '<<< req bod')
    // check has both username and body properties before check whether id exists 
    const bothKeysPresent = checkCommentKeys(newComment) 
        if (bothKeysPresent) {

            return checkArticleIdExists(article_id).then((articleExists) => {
                if (articleExists) {
                    insertComment(article_id, newComment).then((comment) => {
                        res.status(201).send({ comment : comment });
                    });
                } else {
                    console.log('in promise reject ')
                    return Promise.reject({ status: 404, msg: 'Not Found' })
                }
            }) 
            .catch((err) => {
            console.log('in catch block post com')
                next(err);
           });
        } else {
            return Promise.reject({ status: 400, msg: 'Bad Request: missing field(s)' }).catch((err) => {
                console.log('in 400 bad request catch')
                next(err);
            });  
        } 
}

exports.getComments = (req, res, next) => {
    selectComments().then((comments) => {
        res.status(200).send({ comments: comments });
    });
}

exports.deleteComment = (req, res, next) => {
    const comment_id = req.params.comment_id;
    return checkCommentExists(comment_id).then((commentExists) => {
        if(commentExists) {
            removeComment(comment_id).then((comment) => {
                res.status(204).send(comment);
            })
        } else {
            return Promise.reject({ status: 404, msg: 'Not Found' });
        }
    })    
    .catch((err) => {
        next(err);
    });
}

exports.getComment = (req, res, next) => {
    const comment_id = req.params.comment_id;
    return checkCommentExists(comment_id).then((commentExists) => {
        if(commentExists) {
            selectComment(comment_id).then((comment) => {
                res.status(200).send({ comment: comment });
            });
        } else {
            return Promise.reject({ status: 404, msg: 'Not Found' });
        }
    })            
    .catch((err) => {
        next(err);
    });
}