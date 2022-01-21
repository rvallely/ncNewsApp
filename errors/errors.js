exports.handle404s = (req, res) => {
    console.log('in handle 404s')
    res.status(404).send({ msg: 'Invalid URL' });
}

exports.handleCustomErrors = (err, req, res, next) => {
    console.log('err in custom error handling')
    if(err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
}


exports.handleServerErrors = (err, req, res, next) => {
    console.log('<<inside handleServerErrors')
    res.status(500).send({ msg: 'Internal server error' });
}

exports.handlePsqlErrors = (err, req, res, next) => {
    console.log('in psql error block')
    if(err.code === '22P02') {
        console.log('error code is 22P02')
        res.status(400).send({ msg: 'Bad Request' });
    } else {
        next(err);
    }
}