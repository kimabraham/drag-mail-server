const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");

const expressLoader = async (app) => {
  const PORT = process.env.PORT || 3000;

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
  app.use(
    cors({
      origin: [process.env.CLIENT_URL],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}`)
  );
};

module.exports = expressLoader;
