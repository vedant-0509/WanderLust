const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const controller = require("../controller/user.js");


//SignupForm
router.route("/signup")
    .get(controller.signupForm)
    .post(wrapAsync(controller.signup));


//LoginForm
router.route("/login")
    .get(controller.loginForm)
    .post(saveRedirectUrl, wrapAsync(controller.login));


// Google login
router.get("/auth/google", controller.googleLogin);


// Google callback
router.get("/auth/google/callback", saveRedirectUrl, controller.googleCallback);


//Logout
router.get("/logout", controller.logout);


module.exports = router;