const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const findUser = await User.findOne({ googleId: id });
        if (findUser) {
          return cb(null, findUser);
        } else {
          const newUser = await User.create({
            email: emails[0].value,
            googleId: id,
            name: displayName,
            avatarUrl: photos[0].value,
          });

          return cb(null, newUser);
        }
      } catch (error) {
        cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await User.findById(id);
  cb(null, user);
});
