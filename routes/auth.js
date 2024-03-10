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

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/logout", logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/api/auth/failed",
  })
);
router.get("/success", verifyAuth);
router.get("/failed", failedAuth);

module.exports = router;
