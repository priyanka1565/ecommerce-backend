
// this class is for status code error handellinbg 
class ErorroHandler extends Error{

    constructor(message, statusCode) {
        // super is a constructor function of  extendable class 
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    };
};

// exports this file controllers

module.exports = ErorroHandler;