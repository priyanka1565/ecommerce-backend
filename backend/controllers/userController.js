const ErorroHandler = require("../utils/errorHandller");
const catchAsyncErrors = require("../midddleware/catchAsyncerror");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
// make user registration functio9n

exports.userRegistration = catchAsyncErrors(async (req, res, next) => {

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

 // destructuring of object
  const { name, email, password } = req.body;
  
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: myCloud.public_id,
        image_url: myCloud.secure_url,
      },
    });
  sendToken(user, 201, res);
});

/// makre logIn user function

exports.userLogin = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // check user enter correct email and password or not
  if (!email || !password) {
    return next(
      new ErorroHandler("please enter valid password and email", 400)
    );
  }

  // if user found
  const user = await User.findOne({ email }).select("+password");
  // if user mot found
  if (!user) {
    return next(new ErorroHandler("please enter valid email or password", 401));
  }
  // check password
  const passwordCheck = user.comparePassword(password);
  // notmatch
  if (!passwordCheck) {
    next(new ErorroHandler("please enter valid password or email", 401));
  }
  // match
  sendToken(user, 200, res);
});

// logout

exports.userlogOut = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now),
    httpOnly: true,
  });

  res.status(200).json({
    succsess: true,
    message: "LogOut",
  });
});

// forgot password funbctiuon

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErorroHandler("user not found", 404));
  }

  // get reset password token

  const resetToken = user.genrateResetPassword();

  await user.save({ validateBeforeSave: false });

  // reset password url

  const resetpasswordUrl = `${req.protocol}//${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `
    Your password reset link is :- \n\n ${resetpasswordUrl} \n\n
    if you have not requested for this service please ignore it 
    `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Apna online shop Password recovery",
      message,
    });
    res.status(200).json({
      succsess: true,
      message: `Email is successfully send to ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpired = undefined;
    // save user again after reset password
    await user.save({ validateBeforeSave: false });

    return next(new ErorroHandler(err.message, 500));
  }
});

// searching previous password in database using token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpired: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErorroHandler("user password token not match", 400));
  }

  if (req.body.password !== req.body.comparePassword) {
    return next(new ErorroHandler("user password token not match", 400));
  }

  // if password match upate password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpired = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get user details only login user get this

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    succsess: true,
    user,
  });
});

// update user password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  // check password
  const passwordCheck = await user.comparePassword(req.body.oldPassword);
  // notmatch
  if (!passwordCheck) {
    next(new ErorroHandler("old password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    next(new ErorroHandler(" confirm  password is incorrect", 400));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user, 200, res);
});

// update user profile

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  // adding cloudinary 
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      image_url:myCloud.secure_url,
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    succsess: true,
  });
});

// get all user admin
exports.getAllusers = catchAsyncErrors(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    succsess: true,
    users,
  });
});

// get single user admin

exports.getSingleuser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErorroHandler(`user not found with given ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    succsess: true,
    user,
  });
});

// update normal user to admin --admin

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

   await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    succsess: true,
  });
});

// delete user --- admin

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErorroHandler(`user not found with given ${req.params.id}`, 400)
      );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    succsess: true,
    message: "user deleted sucsesfully ",
  });
});
