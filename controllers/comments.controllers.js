const { insertComment, selectComments, removeComment, selectComment, updateComment } = require('../models/comments.models.js');
const { checkArticleIdExists, checkCommentKeys, checkCommentExists, checkUserExists, checkValuesValid } = require('../utils/utils.js');

exports.postComment = (req, res, next) => {
    const article_id = req.params.article_id;
    const newComment = req.body;

    const bothKeysPresent = checkCommentKeys(newComment);
        if (bothKeysPresent) {
            return checkArticleIdExists(article_id).then((articleExists) => {

                if (articleExists) {
                    return checkUserExists(newComment.username).then((userExists) => {
                        if (userExists === true) {
                            insertComment(article_id, newComment).then((comment) => {
                                res.status(201).send({ comment : comment });
                            });
                        } else {
                            return Promise.reject({ status: 400, msg: 'Bad Request: User not in the database' })
                            .catch((err) => {
                              next(err);
                            });
                        }
                    });
                    
                } else {
                    return Promise.reject({ status: 404, msg: 'Not Found' })
                    .catch((err) => {
                        next(err);
                   });
                }
            }) 
            .catch((err) => {
                next(err);
           });
        } else {
            return Promise.reject({ status: 400, msg: 'Bad Request: missing field(s)' })
            .catch((err) => {
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

exports.patchComment = (req, res, next) => {
    let comment_id = req.params.comment_id;  
    let patchObj = req.body;

    if (!patchObj.hasOwnProperty('inc_votes')) {
    
       patchObj = { inc_votes: 0 };
    } 

    const valuesValid = checkValuesValid(patchObj, comment_id);

        if (valuesValid === true) {

            return checkCommentExists(comment_id).then((commentExists) => {
                if (commentExists) {
                    updateComment(comment_id, patchObj).then((updatedComment) => {
                        res.status(200).send({ updatedComment: updatedComment });
                    })
                    .catch((err) => {
                        next(err);
                    });
                } else {
                    return Promise.reject({ status: 404, msg: 'Not Found: comment id does not exist' })
                    .catch((err) => {
                         next(err);
                    });
                }
            });
        } 
        else if (valuesValid === false) {
            return Promise.reject({ status: 400, msg: 'Bad Request: Invalid data type' })
            .catch((err) => {
                next(err);
            });
        }
}