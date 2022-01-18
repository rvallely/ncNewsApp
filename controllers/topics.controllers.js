const { selectTopics } = require('../models/topics.models.js');

exports.getTopics = (req, res, next) => {
    //console.log('in the topics controller')
    selectTopics().then((topics) => {
        //console.log(topics, '<<<topics in controller')
        res.status(200).send({ topics: topics })
   });
}
