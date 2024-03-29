const { insertComment, selectComments, deleteComments, updateComment } = require('../models/comments.models.js');
const { articleExists, commentExists, checkUserExists, commentOrArticleUpdateBodyValid } = require('../utils/utils.js');

exports.getCommentsByArticleId = async (req, res, next) => {
    const { articleId } = req.params;
    const { sortBy, order } = req.query;

    const article =  await articleExists(articleId);

    if (article) {
        if (sortBy) {
            if (!(
                (sortBy === 'created_at' || sortBy === 'votes') 
                &&
                (order === 'ASC' || order === 'DESC')
                )
                )
                {
                    next({ status: 400, msg: 'Bad Request: Invalid query.' });
                }
        }
        const comments = await selectComments({...req.params, ...req.query})
        res.status(200).send({ comments });
    } else {
        next({ status: 404, msg: 'Not Found' })
    }
}

exports.getComments = async (req, res, next) => {
    const comments = await selectComments(req.query)
    res.status(200).send({ comments });
}

exports.patchComment = async (req, res, next) => {
    let { id } = req.params;  

    const comment = commentExists(id);
    if (comment && commentOrArticleUpdateBodyValid(req.body)) {
        const updatedComment = await updateComment(id, req.body);
        res.status(200).send({ comment: updatedComment });
    } else {
        return next({ status: 400, msg: 'Bad Request: id or update values invalid.' });
    }
}

exports.postComment = async (req, res, next) => {
    const { articleId } = req.params;

    const article = await articleExists(articleId);
    if (article) {
        if (req.body.hasOwnProperty('body') && req.body.hasOwnProperty('username')) {
            const userExists = await checkUserExists(req.body.username);
            if (userExists) {
                const comment = await insertComment(articleId, req.body)
                res.status(201).send({ comment });
            } else {
                next({ status: 400, msg: 'User not found, please log in.' });
            }
        } else {
            next({ status: 400, msg: 'Missing body or username.' });
        }
    } else {
        next({ status: 404, msg: 'Article not found.' });
    } 
}

exports.deleteComment = async (req, res, next) => {
    const id = req.params.id;
    const commentInDb = await commentExists(id);
    
    if(commentInDb) {
        try {
            await deleteComments({id});
            res.status(200).send('Successfully deleted comment');
        } catch (err) {
            console.log('ERROR: ', JSON.stringify(err));
            next({ status: 500, msg: 'Something went wrong, please try again.' });
        }
    } else {
        next({ status: 404, msg: 'Not Found' });
    }
}
