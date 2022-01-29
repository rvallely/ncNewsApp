const { rows } = require('pg/lib/defaults');
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

exports.checkColumnExists = (query) => {
    console.log(query.sort_by, '<<< query');
    
    if (query.sort_by === undefined ||
        query.sort_by === 'author' ||
        query.sort_by === 'title' ||
        query.sort_by === 'article_id' ||
        query.sort_by === 'topic' ||
        query.sort_by === 'created_at' ||
        query.sort_by === 'votes' ||
        query.sort_by === 'comment_count') {
            console.log('false')
            return true;
    } else {
        return false;
    }
}

exports.checkTopicExists = (topic) => {
    return db.query(
        `SELECT * FROM articles
        WHERE topic = $1`, [topic]
    ).then((result) => {
        if (topic === undefined) {
            return true;
        }
        if (result.rows.length === 0) {
            return 'invalid topic';
        } else if (result.rows.length > 0) {
            return true;
        }
    });
}
