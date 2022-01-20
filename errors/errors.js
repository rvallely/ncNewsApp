//handlePsqlErrors, handleServerErrors, handleCustomErrors, handle404s
// think need to write controllers for above
// prob need to require in models too

exports.handle404s = (req, res) => {
    res.status(404).send({ msg: 'Invalid URL' });
}
/*
exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request' });
    } else {
        next(err);
    }
}
*/
exports.handleCustomErrors = (err, req, res, next) => {
    console.log('err in custom error handling')
    console.log(err)
    if(err.status) {
        console.log('err in custom error handling if block')
        res.status(err.status).send({ msg: err.msg });
    } else {
        console.log('err in custom error handling else block')
        next(err);
    }
}
/*
exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' });
}
*/