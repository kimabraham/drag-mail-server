const express = require("express");
const { sendMail } = require("../controllers/mail.controller");

const router = express.Router();

router.post("/", sendMail);

module.exports = router;
