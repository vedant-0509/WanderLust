const express = require("express");
const app = express();
const session = require('express-session')
const ejsMate = require("ejs-mate");

const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);


app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));

const flash = require('connect-flash');


const sessionParameter = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}
app.use(flash());
app.use(session(sessionParameter));

app.get("/hello", (req, res) => {
    res.locals.msg = req.flash("done");
    res.locals.err = req.flash("error");
    res.render("hello.ejs", { name: req.session.name });
});

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if(req.session.name == "anonymous"){
        req.flash("error", "Login Faild");
    }else{
        req.flash("done", "Login successfully");
    }
    res.redirect("/hello");
});


// app.get("/home", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
    
//     res.send(`hi vedant click ${req.session.count} times`);
// })


// Server
app.listen(3000, () => {
  console.log(`Server running on port 8080`);
})