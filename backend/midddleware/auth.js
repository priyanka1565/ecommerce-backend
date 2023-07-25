const ErorroHandler = require("../utils/errorHandller");
const catchAsyncErrors = require("./catchAsyncerror");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
exports.isuserAuth = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies;
   
    if (!token) {
        return next(new ErorroHandler("please log in to access this resource", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRETE);

    req.user = await User.findById(decodeData.id);

    next();

});

// make admin authorise role

exports.authoriseRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErorroHandler(
                `Roles:${req.user.role},not allow to use this resource`,
                403
              )
            );
        }
        next();
    };
};