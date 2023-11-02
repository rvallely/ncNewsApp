const users = require('./users');

const genericCommentBodies = [
  "This article provides valuable insights on the topic. Well done!",
  "I appreciate the thorough thought that went into this piece.",
  "The author's writing style is engaging and easy to follow.",
  "I found this article to be informative and thought-provoking.",
  "Great job at presenting your viewpoint.",
  "I've learned a lot from reading this. Thanks for sharing!",
  "This is relatable.",
  "I like how the author breaks down complex concepts into simple terms.",
  "This article is a great resource for anyone looking to learn more.",
  "The conclusion ties everything together nicely.",
  "I enjoyed reading this. It's well-organized and flows smoothly.",
  "Loved this.",
  "I appreciate the author's unique perspective.",
  "The article addresses important issues and provides potential solutions.",
  "constructive article",
  "The author's passion for the subject matter really shines through in this article.",
"This article is a great starting point for anyone looking to delve deeper into the topic.",
"I found the author's writing to be both informative and engaging.",
"great content",
"really enjoyed this",
"great stuff!",
"The article is well-structured, making it easy to follow and understand.",
"This piece encourages critical thinking and further exploration of the subject.",
"The author's expertise is evident throughout the article.",
"I've bookmarked this article for future reference. It's a valuable resource.",
"I like the approach to the subject matter.",
"This article has broadened my perspective.",
"enjoyed this.",
"relly interesting",
"I look forward to reading more from this author in the future.",
"The practical advice offered in this article is incredibly useful.",
"I appreciate how the author addresses the topic.",
"The article is a well-rounded resource.",
"The author's ability to simplify complex ideas is truly impressive.",
"I enjoyed the relatable anecdotes shared in this piece.",
"The author's conversational tone makes the content approachable.",
"This article is a great starting point for a deeper exploration.",
"interesting article.",
"I like how the article engages its audience.",
"thorough understanding of the subject.",
"I always love this author's articles.",
"I find myself coming back to this article for reference time and again.",
"The article serves as a valuable resource for anyone seeking information on this subject.",
"The comments section here fosters a sense of community and learning.",
"I appreciate the author's commitment to keeping the content up-to-date.",
];

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * ((max - min) + 1) + min);
}

module.exports = genericCommentBodies.map((commentBody) => {
  return {
    body: commentBody,
    votes: getRandomInt(0, 5),
    author: users[getRandomInt(0, 5)].username,
    article_id: getRandomInt(1, 72),
    created_at: new Date(getRandomInt(1588089852000, 1698509052000)),
  }
});
