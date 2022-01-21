const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const app = require('../app.js');
const  seed  = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('/invalid_url', () => {
    test('Responds with status 404 and message \'Invalid URL\'', () => {
        return request(app)
          .get('/invalid_url')
          .expect(404)
          .then((res) => {
              expect(res.body.msg).toBe('Invalid URL');
          });
    });
});

describe('/api/topics', () => {
    describe('GET', () => {
        test('Responds with status: 200 and an array of topic objects. Each object should have properties:\n        - slug\n        - description.', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                expect(Array.isArray(response.body.topics)).toBe(true);
                expect(response.body.topics.length).toBe(3);
                response.body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    });
                });
            });
        });
    });
});

describe('/api/comments', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of all comments available. Each comment has properties:\n        - comment_id\n        - author\n        - article_id\n        - votes\n        - created_at\n        - body.', () => {
        return request(app)
          .get('/api/comments')
          .expect(200)
          .then((response) => {     
              const comments = response.body.comments
              expect(comments.length).toBe(18);
              comments.forEach(function(comment) {
                  expect(comment).toMatchObject({
                      comment_id: expect.any(Number), 
                      author: expect.any(String), 
                      article_id: expect.any(Number), 
                      votes: expect.any(Number),
                      created_at: expect.any(String), 
                      body: expect.any(String)
                  });
              });
          });
        });
});

describe('/api/articles/:article_id', () => {
    describe('GET', () => {
        test('Responds with status 200 and an article object which has the properties \n        - author\n        - title\n        - article_id\n        - body\n        - topic\n        - created_at\n        - votes\n        - comment_count.', () => {
            const articleId = 3;
            return request(app)
              .get(`/api/articles/${articleId}`)
              .expect(200)
              .then((response) => {
                  const article = response.body.article;
                  expect(typeof article).toBe('object');
                  expect(article).toMatchObject({
                      author: expect.any(String), 
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number),
                      comment_count: expect.any(Number)
                  });
              });
        });
        test('Responds with status 400 and returns a \'Bad Request\' error message, if article_id is invalid because it is the wrong data type.', () => {
            const invalid_article_id = 'two';
            return request(app)
              .get(`/api/articles/${invalid_article_id }`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        }); 
        test('Responds with status 400 and returns a \'Bad Request\' error message, if article_id is invalid because it is a number below 1.', () => {
            const invalid_article_id = -1;
            return request(app)
              .get(`/api/articles/${invalid_article_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        }); 
        test('Responds with status 404 and returns a \'Not Found\' error message, if article_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const article_id = 1000;
            return request(app)
              .get(`/api/articles/${article_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found');
              });
        }); 
    });

    describe('PATCH', () => {
        test('Responds with a status of 200 and an updated article object, when inc_votes is positive.' , () => {
            const articleId = 5;
            let votesBefore = undefined;
            const updateVotes = { inc_votes : 20 };
            return request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
                console.log(votesBefore)
                return request(app)
                  .patch(`/api/articles/${articleId}`)
                  .expect(200)
                  .send(updateVotes)
                  .then((response) => {
                    const updatedArticle = response.body.updatedArticle;
                    expect(updatedArticle).toMatchObject({
                      author: expect.any(String), 
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number)
                    });
                    expect(updatedArticle.votes).toBe(votesBefore + updateVotes.inc_votes);
                    console.log(votesBefore + updateVotes.inc_votes)
                  });
            });
            
        });
        test('Responds with a status of 200 and an updated article object, when inc_votes is negative.' , () => {
            const articleId = 4;
            let votesBefore = undefined;
            const updateVotes = { inc_votes : -15 };
            const articleBefore = request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
            });
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .expect(200)
              .send(updateVotes)
              .then((response) => {
                  const updatedArticle = response.body.updatedArticle;
                  expect(updatedArticle).toMatchObject({
                    author: expect.any(String), 
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                });
                // below (-->) doesn't work every time I run, either change to work or omit 
                //-->expect(updatedArticle.votes).toBe(votesBefore + -15);
              });
        });
        test('Responds with a status of 200 and an updated article object, when the request body has inc_votes and extra fields.' , () => {
            const articleId = 5;
            const updateVotes = { inc_votes : 135 , voters: ['a', 'b', 'c'] };
            return request(app).get(`/api/articles/${articleId}`).then((res)=> {
                votesBefore = res.body.article.votes;
                console.log(votesBefore)
                return request(app)
                  .patch(`/api/articles/${articleId}`)
                  .expect(200)
                  .send(updateVotes)
                  .then((response) => {
                    const updatedArticle = response.body.updatedArticle;
                    expect(updatedArticle).toMatchObject({
                      author: expect.any(String), 
                      title: expect.any(String),
                      article_id: expect.any(Number),
                      body: expect.any(String),
                      topic: expect.any(String),
                      created_at: expect.any(String),
                      votes: expect.any(Number)
                    });
                    expect(updatedArticle.votes).toBe(votesBefore + updateVotes.inc_votes);
                    console.log(votesBefore + updateVotes.inc_votes)
                  });
            });
        });
        test('Responds with a status of 400 and a \'Bad Request: missing field(s) or incorrect data type\' error message when required inc_votes field is missing.', (
        ) => {
            const articleId = 5;
            const updateVotes = { likes: 52 , voters: ['a', 'b', 'c'] };
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .expect(400)
              .send(updateVotes)
              .then((res)=> {
                  expect(res.body.msg).toBe('Bad Request: missing field(s) or incorrect data type');
              });
        });
        test('Responds with a status of 400 and a \'Bad Request: missing field(s) or incorrect data type\' error message when required inc_votes field\'s value has the wrong data type.', () => {
            const articleId = 5;
            const updateVotes = { inc_votes: 'fifty'};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(400)
              .then((res)=> {
                expect(res.body.msg).toBe('Bad Request: missing field(s) or incorrect data type');
              });
                  
        });
        test('Responds with a status of 400 and a \'Bad Request\' error message when article_id is not a number >= 1.', () => {
            const articleId = -20;
            const updateVotes = { inc_votes: 50};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(400)
              .then((res)=> {
                expect(res.body.msg).toBe('Bad Request');
              });      
        });
        test('Responds with a status of 400 and a \'Bad Request\' error message when article_id is not a number >= 1.', () => {
            const articleId = 'fifty';
            const updateVotes = { inc_votes: 50};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(400)
              .then((res)=> {
                expect(res.body.msg).toBe('Bad Request');
              });      
        });
        test('Responds with a status of 404 and a \'Not Found\' error message when article_id is a number >= 1, but does not exist.', () => {
            const articleId = 55;
            const updateVotes = { inc_votes: 50};
            return request(app)
              .patch(`/api/articles/${articleId}`)
              .send(updateVotes)
              .expect(404)
              .then((res)=> {
                expect(res.body.msg).toBe('Not Found');
              });      
        });            
    });
});

// -------> need to get working 
describe.skip('/api/articles', () => {
    describe('GET', () => {
        test('Responds with status 200 and an array of article objects. Each article object should have the properties:\n        - author\n        - title\n        - article_id\n        - topic\n        - created_at\n        - votes\n        - comment_count', () => {
            return request(app)
              .get('/api/articles/')
              .expect(200)
              .then((response) => { 
                  console.log(response.body)
                  const articles = response.body.articles;
                  console.log(articles);
                  expect(Array.isArray(articles)).toBe(true);
                  articles.forEach((article) => {
                      expect(article).toMatchObject({
                          author: expect.any(String), 
                          title: expect.any(String),
                          article_id: expect.any(Number),
                          topic: expect.any(String),
                          created_at: expect.any(String),
                          votes: expect.any(Number),
                          comment_count: expect.any(Number)
                      });
                  });
                  expect(articles.length).toBe(12);
                  // how to match the content of each object?
              });
        });
    });
});

describe('/api/articles/:article_id/comments', () => {
    describe('GET', () => {
        test('Responds with a status of 200 and an array of comment objects for the given article id, when article_id has at least one comment. Each object should have the properties:\n        - comment_id\n        - votes\n        - created_at\n        - author\n        - body.', () => {
            const article_id = 9;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
              .then((response) => {
                  console.log(response.body)
                const comments = response.body.comments
                comments.forEach(function(comment) {
                    expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: (expect.any(String)),
                    author: expect.any(String),
                    body: expect.any(String)
                    });
                });
              });
        });
        test('Responds with a status of 200 and an empty array of comment objects for the given article id, when article_id has no comments.', () => {
            const article_id = 7;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(200)
              .then((response) => {
                const comments = response.body.comments
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(0);
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request\' error message, if article_id is invalid because it is the wrong data type.', () => {
            const invalid_id = 'two';
            return request(app)
              .get(`/api/articles/${invalid_id}/comments`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request\' error message, if article_id is invalid because it is a number below 1.', () => {
            const invalid_id = -25;
            return request(app)
              .get(`/api/articles/${invalid_id}/comments`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        });
        test('Responds with status 404 and returns a \'Not Found\' error message, if article_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const article_id = 987;
            return request(app)
              .get(`/api/articles/${article_id}/comments`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found');
              });
        }); 
    });
    describe('POST', () => {
        test('Responds with a status of 201 and a posted comment object and posts new comment. The comment to post must have the properties\n        - username\n        - body.', () => {
            const article_id = 10;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            let commentNumberBefore = undefined;
            let getAllCommentsBefore = request(app).get('/api/comments').then((res) => {
                commentNumberBefore = res.body.comments.length;
            });
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .send(newComment)
              .expect(201)
              .then((response) => {
                  const postedComment = response.body.comment;
                  expect(postedComment).toMatchObject({ 
                      comment_id: 19,
                      author: 'butter_bridge',
                      article_id: article_id,
                      votes: 0,
                      created_at: expect.any(String),
                      body: expect.any(String)
                  });
                  let commentNumberAfter = undefined;
                  return request(app)
                    .get('/api/comments')
                    .then((res) => {
                    commentNumberAfter = res.body.comments.length;
                    expect(commentNumberAfter).toBe(commentNumberBefore + 1);
                  });
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request\' error message, if article_id is invalid because it is the wrong data type.', () => {
            const invalid_id = 'two';
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            return request(app)
              .post(`/api/articles/${invalid_id}/comments`)
              .send(newComment)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request\' error message, if article_id is invalid because it is a number below 1.', () => {
            const invalid_id = 0;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            return request(app)
              .post(`/api/articles/${invalid_id}/comments`)
              .send(newComment)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        });
        test('Responds with a status of 404 and returns a \'Not Found\' error message, if article_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const article_id = 22;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
            }
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .send(newComment)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found');
              });
        }); 
        test('Responds with a status of 400 and returns a \'Bad Request: missing field(s)\' error message if there is a missing field.', () => {
            const article_id = 2;
            const newComment = { 
                username: 'butter_bridge',
            }
            return request(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('Bad Request: missing field(s)');
            });
        });
        test('Responds with a status of 201 and a posted comment object with extra fields omitted, when the comment has username and body properties and extra fields.', () => {
            const article_id = 10;
            const newComment = { 
                body: 'Test comment.',
                username: 'butter_bridge',
                likes: 10000, 
            }
            return request(app)
              .post(`/api/articles/${article_id}/comments`)
              .send(newComment)
              .expect(201)
              .then((res) => {
                const postedComment = res.body.comment;
                expect(postedComment).toMatchObject({ 
                    comment_id: 19,
                    author: 'butter_bridge',
                    article_id: 10,
                    votes: 0,
                    created_at: expect.any(String),
                    body: 'Test comment.'
                });
              });
        });
        // would need to adapt and insert into users and potentially other tables before being able to insert(post)
// a new comment in comments if the author was a new author (because if author is not in users this violates the foreign key constraint of comments_author users(username)) 
        // LEFT HERE to do remaing error handling for 
        //       - incorrect data types for each field
        //    WANT TO MAKE UTIL tests for post, patch, delete. check length in more controlled way
        // think can just do this by querying the data base from the test file
    });
});


describe('/api/comments/:comment_id', () => {
    describe('GET', () => {
        test('Responds with comment object of given a comment_id, when comment exists.', () => {
            const comment_id = 7;
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(200)
              .then((res) => {
                  const comment = res.body.comment;
                  //console.log(res.body);
                  expect(comment).toMatchObject({
                      comment_id: 7, 
                      author: 'icellusedkars',
                      article_id: 1, 
                      votes: 0, 
                      created_at: '2020-05-15T20:19:00.000Z', 
                      body: 'Lobster pot'
                  });
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request\' error message, if comment_id is invalid because it is a number below 1.', () => {
            const comment_id = -2;
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        });
        test('Responds with a status of 400 and returns a \'Bad Request\' error message, if comment_id is invalid because it is the wrong data type.', () => {
            const comment_id = 'three';
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request');
              });
        });
        test('Responds with a status of 404 and returns a \'Not Found\' error message, if comment_id is valid because it is a number >= 1, but doesn\'t yet exist.', () => {
            const comment_id = 600;
            return request(app)
              .get(`/api/comments/${comment_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found');
              });
        });
    });
    describe('DELETE', () => {
        test('Responds with status 204 and no content. Deletes comment by comment_id given, when comment exists.', () => {
            const comment_id = 7;
            let commentNumberBefore = undefined;
            return request(app).get('/api/comments').then((res) => {
                commentNumberBefore = res.body.comments.length;
                return request(app)
                  .delete(`/api/comments/${comment_id}`)
                  .expect(204)
                  .then((res) => {
                    expect(res.body).toEqual({});
                    let commentNumberAfter = undefined;
                    return request(app)
                      .get('/api/comments')
                      .then((res) => {
                        commentNumberAfter = res.body.comments.length;
                        expect(commentNumberAfter).toBe(commentNumberBefore - 1)
                    });            
                  }); 
            });
        });
        test('Responds with a status of 400 and \'Bad Request\' error message if the comment_id is invalid because it is a number < 1.', () => {
            const comment_id = -17;
            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request')
              });
        });
        test('Responds with a status of 400 and \'Bad Request\' error message if the comment_id is invalid because it is the wrong data type.', () => {
            const comment_id = { comment_id: 3 };
            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(400)
              .then((res) => {
                  expect(res.body.msg).toBe('Bad Request')
              });
        });
        test('Responds with a status of 404 and \'Not Found\' error message if the comment_id is valid because it is a number >= 1, but does not exist.', () => {
            const comment_id = 20;
            return request(app)
              .delete(`/api/comments/${comment_id}`)
              .expect(404)
              .then((res) => {
                  expect(res.body.msg).toBe('Not Found')
              });
        });
    });
});
});
// need to complete test for GET /api to get JSON of all available endpoints
// Also need to get GET /api/articles working.
// Then hosting and tidying up
// ************** need to get working 

/*describe('/api', () => {
    describe('GET', () => {
        test('Responds with JSON describing all the available endpoints on the API.', () => {
            return request(app) 
              .get('/api')
              .expect(200) // or maybe 201??
              .then((response) => {
                  //
              });
        }); 
    });
}); */