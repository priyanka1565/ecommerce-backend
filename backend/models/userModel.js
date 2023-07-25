const mongoose = require("mongoose");

const validator = require("validator");

const bycrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

// for genrating user reset password 
// make user model 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name "],
    maxlength: [30, "name not exceed given fig"],
    minlength: [4, "name must be include more than 4 charecter"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email "],
    unique: true,
    validate: [validator.isEmail, "please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "please enter valid password"],
    // we admin also not get password of user so select false
    select: false,
    minlength: [8, "please Enter valid password"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpired: Date,
});

// hash passwrd here and make password song 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrypt.hash(this.password, 10);
});

// user login during registraion no seprate login after registration 
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRETE, {
    expiresIn:process.env.JWT_EXPIRE,
  })
}
// CALL THIS METOD IN CONTROLLERS
// make compared password function 
userSchema.methods.comparePassword = async function (enterpasswordpassword) {
  return await bycrypt.compare(enterpasswordpassword,this.password);
} 

// genrating user rset password 
userSchema.methods.genrateResetPassword = function () {
  
  // reset token 
  const resetToken = crypto.randomBytes(20).toString("hex");
  
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex")
  
  this.resetPasswordExpired = Date.now() + 15 * 60 * 60;
    
  return resetToken;
}
// export 
module.exports = mongoose.model("User", userSchema);