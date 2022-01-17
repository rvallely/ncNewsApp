exports.formatTopicData = (topicData) => {
    const formattedTopics = topicData.map((topic) => [topic.slug, topic.description]);
    return formattedTopics;
}

exports.formatUserData = (userData) => {
    const formattedUsers = userData.map((user) => [user.username, user.avatar_url, user.name]);
    return formattedUsers;
}

exports.formatArticleData = (articleData) => {
    //console.log(articleData, '<<< unformatted article data ')
    const formattedArticles = articleData.map((article) => [article.title, article.body, article.votes, article.topic, article.author, article.created_at]);
    //console.log(formattedArticles, '<<<formatted arts.');
    return formattedArticles;
}

exports.formatCommentData = (commentData) => {
    const formattedComments = commentData.map((comment) => [comment.author, comment.article_id, comment.votes, comment.created_at, comment.body]);
    return formattedComments;
}
