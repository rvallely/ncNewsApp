const db = require('../db/connection.js');

//would you need one func for checking if valid
// then another func to check if exists
// if invalid article_id (eg. a string, a negative number, or there's a finite number of articles)
// if(typeof article_id !== 'number' || article_id < 1) {
//    return 400 : Bad Request
//}
// you'd want a 400 Bad Request as there will never be an article with this id

// if valid article_id, but doesn't yet exist (eg. here a number above 12, because theoretically there could be at some point more than 12 articles, if more articles are posted)
// the logic for this would be something like if (article_id > articles.length)
// then you want a 404 Not Found message
// 

// if (article_id >= 1 && article_id <= articles.length) {
//    status 200
//}
// when article_id exists return true if it doesn't exist return false


exports.checkArticleIdExists = (article_id) => {
    console.log('checking article exists')
    console.log(article_id, 'id')
    if (article_id < 1) {
        article_id = 'Invalid article_id';
    }
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1`, [article_id]
    ).then((result) => {
        console.log(result.rows, '<<< rows');
        console.log(result.rows.length)
        if (result.rows.length > 0) {
            console.log('true')
            return true;
        } else {
            console.log('false')
            return false;
        }
    });
}

exports.checkCommentKeys = (newComment) => {
    console.log(newComment, '<<< comm in utils func')
    if(newComment.hasOwnProperty('body') && newComment.hasOwnProperty('username')) {
        return true;
    } else {
        console.log('false in checking')
        return false;
    }
}

exports.checkCommentExists = (comment_id) => {
    if (comment_id < 1) {
        comment_id = 'Invalid comment id';
    }
    return db.query(
        `SELECT * FROM comments
        WHERE comment_id = $1`, [comment_id]
    ).then((result) => {
        console.log(result.rows, '<<< rows');
        console.log(result.rows.length)
        if (result.rows.length > 0) {
            console.log('true')
            return true;
        } else {
            console.log('false')
            return false;
        }
    });
}