const { isValidObjectId } = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");

exports.getProjects = async (req, res, next) => {
  try {
    const {
      query: { userId },
    } = req;

    let projects;

    if (userId) {
      if (isValidObjectId(userId)) {
        projects = await Project.find({ creator: userId });
      } else {
        throw Error("Id is not objectID");
      }
    } else {
      projects = await Project.find();
    }

    res.json({ success: true, projects });
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const {
      user: { _id },
    } = req;

    const userProjects = await Project.find({
      creator: _id,
      title: /My template/i,
    });

    const myTemplateCount = userProjects.length
      ? Number(userProjects.at(-1).title.slice(11)) + 1
      : "";

    const project = await Project.create({
      title: `My template${myTemplateCount}`,
      creator: _id,
    });

    await User.findByIdAndUpdate(_id, {
      $push: { projects: project._id },
    });

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const {
      user: { _id },
      params: { id },
    } = req;
    const findProject = await Project.findById(id);

    if (req.user._id.equals(findProject.creator)) {
      await User.findByIdAndUpdate(_id, {
        $pull: { projects: id },
      });
      await Project.findByIdAndDelete(id);

      res.json({ success: true });
    } else {
      throw Error("Unauthorized");
    }
  } catch (error) {
    next(error);
  }
};

exports.modifyProject = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    await Project.findByIdAndUpdate(id, {});

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
exports.updateProject = async (req, res, next) => {
  try {
    // components에 push
    const {
      params: { id },
    } = req;

    await Project.findByIdAndUpdate(id, {});

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
exports.getProject = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const project = await Project.findById(id);

    res.json({ success: true, project });
  } catch (error) {
    next(error);
  }
};
exports.exportHtml = (req, res, next) => {
  try {
    // convert to html logic
  } catch (error) {
    next(error);
  }
};
exports.exportGoogle = (req, res, next) => {
  try {
    // convert to google template logic
  } catch (error) {
    next(error);
  }
};
