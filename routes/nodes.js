const express = require("express");
const { verifyObjectId } = require("../middlewares/verifyObjectId");
const {
  modifyNode,
  removeBlockNode,
} = require("../controllers/node.controller");

const router = express.Router();

router.put("/:id", modifyNode);
router.delete("/:id", verifyObjectId, removeBlockNode);

module.exports = router;
