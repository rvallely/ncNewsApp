const { insertComment, selectComments } = require('../models/comments.models.js');

exports.postComment = (req, res, next) => {
    const article_id = req.params.article_id;
    const newComment = req.body
    console.log(newComment)
    insertComment(article_id, newComment).then((comment) => {
        console.log(comment)
        res.status(201).send({ comment : comment });
    });
}

exports.getComments = (req, res, next) => {
    console.log('inside commen')
    selectComments().then((comments) => {
        res.status(200).send({ comments: comments });
    });
}