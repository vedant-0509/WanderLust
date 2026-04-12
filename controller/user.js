const express = require("express");
const User = require("../models/user.js");
const passport = require("passport");


module.exports.signupForm = (req, res) => {
    res.render("listing/user/signup", { bodyClass: "signup-page" });
}


module.exports.signup = async (req, res, next) => {
    try {
        let { email, username, password } = req.body;
        let newUser = new User({ email, username });
        await User.register(newUser, password);
        req.login(newUser, (err) => {
            if (err) next(err);
            req.flash("done", "User Created");
            res.redirect("/allList");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    // next();
}


module.exports.loginForm = (req, res) => {
    res.render("listing/user/login.ejs", { bodyClass: "signup-page" });
}


module.exports.login = async (req, res, next) => {
    const { username } = req.body;

    const user = await User.findOne({ username });

    if (user && user.username === user.email) {
        req.flash("error", "Please login using Google");
        return res.redirect("/login");
    }

    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            req.flash("error", "Invalid credentials");
            return res.redirect("/login");
        }

        req.logIn(user, (err) => {
            if (err) return next(err);

            req.flash("done", "Welcome!!");
            let redirectUrl = res.locals.redirectUrl || "/allList"
            return res.redirect(redirectUrl);
        });
    })(req, res, next);
}


module.exports.googleLogin = passport.authenticate("google", { scope: ["profile", "email"] });

module.exports.googleCallback = passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }), (req, res) => {
    req.flash("done", "Logged in with Google!");
    res.redirect("/allList");
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("done", "Logged Out Successfully");
        res.redirect("/allList");
    })
}