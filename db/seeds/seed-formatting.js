exports.formatTopicData = (topicData) => {
    return topicData.map(({ name, description }) => [name, description]);
}

exports.formatUserData = (userData) => {
    return userData.map(({ username, avatar_url, email, password }) => [username, avatar_url, email, password]);
}

exports.formatArticleData = (articleData) => {
    return articleData.map(({ title, body, votes, topic, author, created_at }) => [title, body, votes, topic, author, created_at]);
}

exports.formatCommentData = (commentData) => {
    return commentData.map(({ author, article_id, votes, created_at, body}) => [author, article_id, votes, created_at, body]);
}
