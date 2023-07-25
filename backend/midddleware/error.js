const ErorroHandler = require("../utils/errorHandller");

// make middleware error for status code handelling function

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error"; 

    // moingodb casttype error
    if (err.name === "CastError") {
        const message = `Resource not found Invalid : ${err.path}`;
        err = new ErorroHandler(message, 400);
    }
    
    res.status(err.statusCode).json({
        succsess: false,
        message:err.message,
    })
}

// export this error handller to the app.js 