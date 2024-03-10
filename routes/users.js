const express = require("express");
const {
  getUsers,
  getUserProject,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");
const router = express.Router();

router.get("/", getUsers);
router.get("/projects", getUserProject);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
