const { updateArticle, selectArticles, insertArticle } = require('../models/articles.models.js');
const { articleExists, checkColumnExists, checkUserExists, commentOrArticleUpdateBodyValid } = require('../utils/utils.js');

exports.getArticles = async (req, res, next) => {
    const { sortBy, order, page } = req.query;

    if (sortBy) {
        const columnValid = checkColumnExists(sortBy);
        if (!(columnValid && (order === 'ASC' || order === 'DESC'))) {
            next({ status: 400, msg: 'Bad Request: Invalid sort by or order values.'});
        } 
    }
    if (page) {
        const articles = await selectArticles(req.query);
        res.status(200).send(articles);
    }
}

exports.patchArticle = async (req, res, next) => {
    let { id } = req.params;  

    const article = await articleExists(id);
    if (article && commentOrArticleUpdateBodyValid(req.body)) {
        const updatedArticle = await updateArticle(id, req.body);
        res.status(200).send({ article: updatedArticle });
    } else {
        next({ status: 400, msg: 'Bad Request: id or update values invalid.' });
    }
}

exports.postArticle = async (req, res, next) => {
    const user = await checkUserExists(req.body.author);

    if (user) {
        const article = await insertArticle(req.body);
        res.status(201).send({ article });
    } else {
        next({status: 400, msg: 'User not found.'})
    } 
}



















exports.deleteArticle = async (req, res, next) => {
    const article_id = req.params.articleId;
    if (articleExists(article_id)) {

    }
    
    // .then((articleExists) => {
    //     if(articleExists) {
    //         removeArticle(article_id, deletedValues).then((blankArticle) => {
    //             res.status(200).send(blankArticle);
    //         })
    //     } else {
    //         return Promise.reject({ status: 404, msg: 'Not Found: this article does not exist.' });
    //     }
    // })    
    // .catch((err) => {
    //     next(err);
    // });
}


