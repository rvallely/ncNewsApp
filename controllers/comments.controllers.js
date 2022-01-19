const { insertComment, selectComments, removeComment, selectComment } = require('../models/comments.models.js');

exports.postComment = (req, res, next) => {
    const article_id = req.params.article_id;
    const newComment = req.body
    insertComment(article_id, newComment).then((comment) => {
        res.status(201).send({ comment : comment });
    });
}

exports.getComments = (req, res, next) => {
    selectComments().then((comments) => {
        res.status(200).send({ comments: comments });
    });
}

exports.deleteComment = (req, res, next) => {
    const comment_id = req.params.comment_id;
    removeComment(comment_id).then((comment) => {
        res.status(204).send(comment);
    })
}

exports.getComment = (req, res, next) => {
    const comment_id = req.params.comment_id;
    selectComment(comment_id).then((comment) => {
        console.log(comment, '<<< comment')
        res.status(200).send({ comment: comment })
    });
}