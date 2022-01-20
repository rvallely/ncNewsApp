// handlePsqlErrors, handleServerErrors, handleCustomErrors, handle404s
// think need to write controllers for above
// prob need to require in models too

exports.handle404s = (req, res) => {
    console.log('in handle 404s')
    res.status(404).send({ msg: 'Invalid URL' });
}

exports.handleCustomErrors = (err, req, res, next) => {
    console.log('err in custom error handling')
    console.log(err)
    console.log(err)
    // if the err has a status then send the status and the error msg
    if(err.status) {
        console.log('err in custom error handling if block')
        res.status(err.status).send({ msg: err.msg });
    // if the err doesn't have a status go to the next 
    } else {
        console.log('err in custom error handling else block')
        next(err);
    }
}


exports.handleServerErrors = (err, req, res, next) => {
    console.log('<<inside handleServerErrors')
    console.log(err)
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