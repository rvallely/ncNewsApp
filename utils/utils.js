const db = require('../db/connection.js');

exports.checkArticleIdExists = (article_id) => {
    if (article_id < 1) {
        article_id = 'Invalid article_id';
    }
    return db.query(
        `SELECT * FROM articles
        WHERE article_id = $1`, [article_id]
    ).then((result) => {
        if (result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

exports.checkCommentKeys = (newComment) => {
    if(newComment.hasOwnProperty('body') && newComment.hasOwnProperty('username')) {
        return true;
    } else {
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
        if (result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

exports.checkPatchKeys = (patchObj) => {
    console.log(patchObj, '<<< patch object')
    if (patchObj.hasOwnProperty('inc_votes') && typeof patchObj.inc_votes === 'number') {
        return true;
    } else {
        return false;
    }
}