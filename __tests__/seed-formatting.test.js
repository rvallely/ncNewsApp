const { formatTopicData, formatUserData, formatArticleData, formatCommentData } = require('../db/seeds/seed-formatting');

//TODO remove/update test file

describe('formatTopicData', () => {
    test('Returns an empty array when passed an empty array of data.', () => {
        const topicData = [];
        const expectedFormattedTopics = [];
        expect(formatTopicData(topicData)).toEqual(expectedFormattedTopics);
    });
    test('Returns a two level deep nested array, with each inner array containing the values of a row in the topics table. Values are the order [slug, description].', () => {
        const topicData = [
            {
              description: 'The man, the Mitch, the legend',
              slug: 'mitch'
            },
            {
              description: 'Not dogs',
              slug: 'cats'
            },
            {
              description: 'what books are made of',
              slug: 'paper'
            }
        ];
        const expectedFormattedTopics = [ ['mitch', 'The man, the Mitch, the legend'], ['cats', 'Not dogs'], ['paper', 'what books are made of'] ]
        expect(formatTopicData(topicData)).toEqual(expectedFormattedTopics)
    });
    test('The original topic data is not mutated.', () => {
        const topicData = [
            {
              description: 'The man, the Mitch, the legend',
              slug: 'mitch'
            },
            {
              description: 'Not dogs',
              slug: 'cats'
            },
            {
              description: 'what books are made of',
              slug: 'paper'
            }
        ];
        const topicDataCopy = [
            {
              description: 'The man, the Mitch, the legend',
              slug: 'mitch'
            },
            {
              description: 'Not dogs',
              slug: 'cats'
            },
            {
              description: 'what books are made of',
              slug: 'paper'
            }
        ];
        formatTopicData(topicData);
        expect(topicData).toEqual(topicDataCopy);
    });
});

describe('formatUserData', () => {
    test('Returns an empty array when given an empty array of data.', () => {
        const userData = [];
        const expectedFormattedUsers = [];
        expect(formatUserData(userData)).toEqual(expectedFormattedUsers);
    });
    test('Returns a two level deep nested array, with each inner array containing the values of a row in the users table. Values are the order [username, avatar_url, name, password].', () => {
        const userData = [
            {
              username: 'butter_bridge',
              email: 'butter_bridge@gmail.com',
              avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', 
              password: 'butter_bridge_pass'
            },
            {
              username: 'icellusedkars',
              email: 'icellusedkars@gmail.com',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4', 
              password: 'icellusedkars_pass'
            },
            {
              username: 'rogersop',
              email: 'rogersop@gmail.com',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4', 
              password: 'rogersop_pass'
            },
            {
              username: 'lurker',
              email: 'lurker@gmail.com',
              avatar_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', 
              password: 'lurker_pass'
            }
        ];
        const expectedFormattedUsers = [ 
            ['butter_bridge', 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg', 'butter_bridge_pass'], 
            ['icellusedkars', 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4', 'icellusedkars_pass'], 
            ['rogersop', 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4', 'rogersop_pass'],
            ['lurker', 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png', 'lurker_pass']  ];
        expect(formatUserData(userData)).toEqual(expectedFormattedUsers);
    });
    test('The original user data is not mutated.', () => {
        const userData = [
            {
              username: 'butter_bridge',
              name: 'jonny',
              avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            },
            {
              username: 'icellusedkars',
              name: 'sam',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            }
        ];
        const userDataCopy = [
            {
              username: 'butter_bridge',
              name: 'jonny',
              avatar_url:
                'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            },
            {
              username: 'icellusedkars',
              name: 'sam',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            }
        ];
        formatUserData(userData);
        expect(userData).toEqual(userDataCopy);
    });
});

describe('formatArticleData', () => {
    test('Returns an empty array when passed an empty array of data.', () => {
        const articleData = [];
        const expectedFormattedArticles = [];
        expect(formatArticleData(articleData)).toEqual(expectedFormattedArticles);
    });
    test('Returns a two level deep nested array, with each inner array containing the values of a row in the articles table. Values are the order [title, body, votes, topic, author, created_at].', () => {
        const articleData = [
            {
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: new Date(1594329060000),
              votes: 100
            },
            {
              title: 'Sony Vaio; or, The Laptop',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
              created_at: new Date(1602828180000),
              votes: 0
            },
            {
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              created_at: new Date(1604394720000),
              votes: 0
            }
        ];
        const expectedFormattedArticles = [
            ['Living in the shadow of a great man', 'I find this existence challenging', 100, 'mitch', 'butter_bridge', new Date(1594329060000)],
            ['Sony Vaio; or, The Laptop', 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.', 0, 'mitch', 'icellusedkars', new Date(1602828180000)], 
            ['Eight pug gifs that remind me of mitch', 'some gifs', 0, 'mitch', 'icellusedkars', new Date(1604394720000)]
        ];
        expect(formatArticleData(articleData)).toEqual(expectedFormattedArticles);
    });
    test('The original article data is not mutated.', () => {
        const articleData = [
            {
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: new Date(1594329060000),
              votes: 100
            },
            {
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              created_at: new Date(1604394720000),
              votes: 0
            }
        ];
        const articleDataCopy = [
            {
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: new Date(1594329060000),
              votes: 100
            },
            {
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              author: 'icellusedkars',
              body: 'some gifs',
              created_at: new Date(1604394720000),
              votes: 0
            }
        ];
        formatArticleData(articleData)
        expect(articleData).toEqual(articleDataCopy);
    });
});

describe('formatCommentData', () => {
    test('Returns an empty array when passed an empty array of data.', () => {
        const commentData = [];
        const expectedFormattedComments = [];
        expect(formatCommentData(commentData)).toEqual(expectedFormattedComments);
    });
    test('Returns a two level deep nested array, with each inner array containing the values of a row in the comments table. Values are the order [author, article_id, votes, created_at, body].', () => {
        const commentData = [
            {
              body: 'Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!',
              votes: 16,
              author: 'butter_bridge',
              article_id: 9,
              created_at: new Date(1586179020000),
            },
            {
              body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
              votes: 14,
              author: 'butter_bridge',
              article_id: 1,
              created_at: new Date(1604113380000),
            },
            {  
              body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
              votes: 100,
              author: 'icellusedkars',
              article_id: 1,
              created_at: new Date(1583025180000),
            },
            {
              body: ' I carry a log — yes. Is it funny to you? It is not to me.',
              votes: -100,
              author: 'icellusedkars',
              article_id: 1,
              created_at: new Date(1582459260000),
            }

        ];
        const expectedFormattedComments = [
            ['butter_bridge', 9, 16, new Date(1586179020000), 'Oh, I\'ve got compassion running out of my nose, pal! I\'m the Sultan of Sentiment!'], 
            ['butter_bridge', 1, 14, new Date(1604113380000), 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'], 
            ['icellusedkars', 1, 100, new Date(1583025180000), 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.'], 
            ['icellusedkars', 1, -100, new Date(1582459260000), ' I carry a log — yes. Is it funny to you? It is not to me.']
        ];
        expect(formatCommentData(commentData)).toEqual(expectedFormattedComments);
    });
    test('The original article data is not mutated.', () => {
        const commentData = [
            {
              body: "I hate streaming noses",
              votes: 0,
              author: "icellusedkars",
              article_id: 1,
              created_at: new Date(1604437200000),
            }, 
            {
              body: "Lobster pot",
              votes: 0,
              author: "icellusedkars",
              article_id: 1,
              created_at: new Date(1589577540000),
            }
        ];
        const commentDataCopy = [
            {
              body: "I hate streaming noses",
              votes: 0,
              author: "icellusedkars",
              article_id: 1,
              created_at: new Date(1604437200000),
            }, 
            {
              body: "Lobster pot",
              votes: 0,
              author: "icellusedkars",
              article_id: 1,
              created_at: new Date(1589577540000),
            }
        ];
        formatCommentData(commentData);
        expect(commentData).toEqual(commentDataCopy);
    });
});

 