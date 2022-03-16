const { type } = require('express/lib/response');
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
    if (Number(comment_id) < 1) {
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
    if (patchObj.hasOwnProperty('inc_votes') && typeof patchObj.inc_votes === 'number') {
        return true;
    } else {
        return false;
    }
}

exports.checkColumnExists = (query) => {
    if (query.sort_by === undefined ||
        query.sort_by === 'author' ||
        query.sort_by === 'title' ||
        query.sort_by === 'article_id' ||
        query.sort_by === 'topic' ||
        query.sort_by === 'created_at' ||
        query.sort_by === 'votes' ||
        query.sort_by === 'comment_count') {
            return true;
    } else {
        return false;
    }
}

exports.checkTopicExists = (topic) => {
    return db.query(
        `SELECT * FROM topics
        WHERE slug = $1`, [topic]
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

exports.checkUserExists = (username) => {
    return db.query(
        `SELECT * FROM users
        WHERE username = $1`, [username]
    ).then((result) => {
        if (result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    });
}

exports.checkUsernameValid = (username) => {
    if (username.length > 30) {
        return 'chars over 30';
    }
    else if (username.length <= 30){
        return true;
    }   
}

exports.checkValuesValid = (patchObj, comment_id) => {
    result = true;
    if (typeof patchObj.inc_votes === 'number' &&  /[\d]+/.test(comment_id)) {
        result = true;
    } else {
        result = false;
    }
    return result;
}

exports.checkReqValid = (article) => {
    if (article.hasOwnProperty('author') &&
        article.hasOwnProperty('title') &&
        article.hasOwnProperty('body') &&
        article.hasOwnProperty('topic') &&
        article.author.length > 0 &&
        article.body.length > 0 &&
        article.title.length > 0 ) 
    {
            return true;
    } else {
        return false;
    }
}

