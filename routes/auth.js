require("../utils/passport");
const express = require("express");
const passport = require("passport");
const {
  verifyAuth,
  failedAuth,
  logout,
  signIn,
  signUp,
} = require("../controllers/auth.controller");
const Project = require("../models/Project");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/logout", logout);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    state: "normal",
  })
);

router.get(
  "/demo",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
    state: "demo",
  })
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/api/auth/failed");
    }
    req.logIn(user, async function (err) {
      if (err) {
        return next(err);
      }
      const state = req.query.state;
      if (state === "demo") {
        const project = await Project.create({
          title: "demo",
          creator: user._id,
        });

        res.redirect(`${process.env.CLIENT_URL}/template/${project._id}`);
      } else {
        res.redirect(process.env.CLIENT_URL);
      }
    });
  })(req, res, next);
});

router.get("/success", verifyAuth);
router.get("/failed", failedAuth);

module.exports = router;
