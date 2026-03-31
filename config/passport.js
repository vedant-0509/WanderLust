const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return done(null, existingUser);
    }

    let newUser = new User({
      email: email,
      username: email   // required for schema
    });

    await User.register(newUser, "google_dummy_password");

    return done(null, newUser);

  } catch (err) {
    return done(err, null);
  }
}));

module.exports = passport;