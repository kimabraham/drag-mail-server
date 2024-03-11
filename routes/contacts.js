const express = require("express");
const {
  updateContact,
  deleteContact,
} = require("../controllers/contact.controller");

const router = express.Router();

router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
