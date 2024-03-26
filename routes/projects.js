require("../utils/passport");
const express = require("express");
const {
  getProjects,
  createProject,
  deleteProject,
  createProjectByDemo,
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
router.post("/demo", createProjectByDemo);
router.delete("/:id", verifyObjectId, deleteProject);
router.put("/:id", modifyProject);
router.patch("/:id", updateProject);
router.get("/:id", getProject);
router.post("/html", exportHtml);
router.post("/google", exportGoogle);

module.exports = router;
