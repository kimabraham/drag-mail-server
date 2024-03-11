const express = require("express");
const {
  getUsers,
  getUserProject,
  getUser,
  updateUser,
  deleteUser,
  getUserContacts,
  createUserContact,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/", getUsers);
router.get("/contacts", getUserContacts);
router.post("/contacts", createUserContact);
router.get("/projects", getUserProject);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
