const express = require("express");
const {
    userRegistration,
    userLogin,
    userlogOut,
    forgotPassword,
    resetPassword,
    getUserDetails, 
    updatePassword,
    updateProfile,
    getAllusers,
    getSingleuser,
    updateUserRole,
    deleteUser} = require("../controllers/userController");

const { isuserAuth, authoriseRole } = require("../midddleware/auth");

const router = express.Router();

// register 
router.route("/register").post(userRegistration);

// login 
router.route("/login").post(userLogin);

// forgot password
router.route("/forgot/password").post(forgotPassword);

// reset password
router.route("/password/reset/:token").put(resetPassword);

// logout 
router.route("/logout").get(userlogOut);
// user details 
router.route("/me").get(isuserAuth, getUserDetails);
/// update password omly for login user 
router.route("/password/update").put(isuserAuth,updatePassword);
// update profile 
router.route("/me/update").put(isuserAuth, updateProfile);

// admin route 
router.route("/admin/users").get(isuserAuth, authoriseRole("admin"), getAllusers);

// admin id related route 
router
  .route("/admin/user/:id")
  .get(isuserAuth, authoriseRole("admin"), getSingleuser)
  .put(isuserAuth, authoriseRole("admin"), updateUserRole)
  .delete(isuserAuth, authoriseRole("admin"),deleteUser);

module.exports = router;

// imprt in app.js
