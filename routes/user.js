const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
// passport.use(new LocalStrategy(User.authenticate()));

router.get("/signup", (req, res) => {
    res.render("listing/user/signup.ejs");
});


router.post("/signup", wrapAsync(async(req, res, next) => {
    try{
        let {email, username, password} = req.body;
        let newUser = new User({email, username});
        await User.register(newUser, password);
        req.flash("done", "User Created");
        res.redirect("/allList");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    next();
}));


router.get("/login", (req, res) => {
    res.render("listing/user/login.ejs");
});


router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(async(req, res, next) => {
    req.flash("done", "Welcome!!");
    res.redirect("/allList");
}));


module.exports = router;