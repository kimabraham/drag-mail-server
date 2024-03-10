require("../utils/passport");
const express = require("express");
const {
  getProjects,
  createProject,
  deleteProject,
  modifyProject,
  updateProject,
  exportHtml,
  exportGoogle,
  getProject,
} = require("../controllers/project.controller");
const { verifyObjectId } = require("../middlewares/verifyObjectId");

const router = express.Router();

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", verifyObjectId, deleteProject);
router.put("/:id", verifyObjectId, modifyProject);
router.patch("/:id", verifyObjectId, updateProject);
router.get("/:id", verifyObjectId, getProject);
router.post("/html", exportHtml);
router.post("/google", exportGoogle);

module.exports = router;
