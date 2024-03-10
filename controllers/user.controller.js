const Project = require("../models/Project");
const User = require("../models/User");
require("../utils/passport");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
exports.getUserProject = async (req, res, next) => {
  try {
    const projects = await Project.find({ creator: req.user._id });
    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};
exports.getUser = async (req, res, next) => {};
exports.updateUser = async (req, res, next) => {};
exports.deleteUser = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
