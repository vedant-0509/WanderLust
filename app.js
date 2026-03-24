const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");

const methodOverride = require("method-override");

const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");

const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');


// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);


// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser("secretcode"));


// DB Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err));


const sessionParameter = {
  secret: 'codesecrete',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, 
  }
}
app.use(flash());
app.use(session(sessionParameter));

app.use((req, res, next) => {
  res.locals.done = req.flash("done");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.use("/allList", listingRoutes);
app.use("/listing/:id/review", reviewRoutes);



// 404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// Error Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listing/error", { message });
});


// Server
app.listen(8080, () => {
  console.log(`Server running on port 8080`);
})