const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const Node = require("../models/Node");
const { PATCH_PROJECT_TYPES } = require("../utils/constants");
const {
  saveNodeRecursive,
  convertDbToNode,
  collectAllChildNodeIds,
  findNodeByClassName,
} = require("../utils/nodeToDb");

exports.getProjects = async (req, res, next) => {
  try {
    const {
      query: { userId },
    } = req;

    let projects;

    if (userId) {
      if (mongoose.isValidObjectId(userId)) {
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
      _id: userId,
      params: { id: projectId },
    } = req;

    const findProject = await Project.findById(projectId);
    if (!findProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (!req.user._id.equals(findProject.creator)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } });

    const allNodeIdsToDelete = [];
    for (const rowId of findProject.component) {
      const childNodeIds = await collectAllChildNodeIds(rowId);
      allNodeIdsToDelete.push(...childNodeIds);
    }

    if (allNodeIdsToDelete.length > 0) {
      await Node.deleteMany({ _id: { $in: allNodeIdsToDelete } });
    }

    await Project.findByIdAndDelete(projectId);

    res.json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    next(error);
  }
};

exports.modifyProject = async (req, res, next) => {
  try {
    const {
      params: { id },
      body: { project },
    } = req;

    const rootNodes = await Promise.all(
      project.component.map((componentNode) => saveNodeRecursive(componentNode))
    );

    await Project.findByIdAndUpdate(id, {
      ...project,
      component: rootNodes.map((node) => node._id),
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const {
      params: { id },
      body: { projectId, nodeObject, rowIndex, colIndex, type },
    } = req;

    console.log(
      "projectId",
      projectId,
      "nodeObject",
      nodeObject,
      "rowIndex",
      rowIndex,
      "colIndex",
      colIndex,
      "type",
      type
    );

    let project;

    switch (type) {
      case PATCH_PROJECT_TYPES.ADD_ROW:
        const updateRowNode = await saveNodeRecursive(nodeObject);

        if (id !== projectId) {
          throw Error("Id is not matched.");
        }

        project = await Project.findByIdAndUpdate(
          id,
          {
            $push: {
              component: {
                $each: [updateRowNode._id],
                $position: rowIndex,
              },
            },
          },
          { new: true }
        );

        return res.json({ success: true, project });
      case PATCH_PROJECT_TYPES.REMOVE_ROW:
        if (id !== projectId) {
          throw Error("Id is not matched.");
        }

        const objectIdToRemove = new mongoose.Types.ObjectId(nodeObject.id);

        project = await Project.findByIdAndUpdate(
          id,
          {
            $pull: { component: objectIdToRemove },
          },
          { new: true }
        );

        const allNodeIdsToDelete = await collectAllChildNodeIds(
          objectIdToRemove
        );

        await Node.deleteMany({ _id: { $in: allNodeIdsToDelete } });

        return res.json({ success: true, project });
      case PATCH_PROJECT_TYPES.ADD_BLOCK:
        const updatedBlockNode = await saveNodeRecursive(nodeObject);

        if (id !== projectId) {
          throw Error("Id is not matched.");
        }

        const findProject = await Project.findById(id);

        const findContainerRow = await Node.findById(
          findProject.component[rowIndex]
        );

        const contentRowNode = await findNodeByClassName(
          findContainerRow._id,
          "content-row"
        );

        const contentColId = contentRowNode.children[colIndex]._id;

        const defaultTableIdToDelete =
          contentRowNode.children[colIndex].children[0]._id;

        await Node.findByIdAndDelete(defaultTableIdToDelete);

        await Node.findByIdAndUpdate(contentColId, {
          $set: { children: updatedBlockNode._id },
        });

        return res.json({ success: true });
      default:
        break;
    }
  } catch (error) {
    next(error);
  }
};

exports.getProject = async (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    const project = await Project.findById(id).populate("component");

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const componentTrees = await Promise.all(
      project.component.map((componentId) => convertDbToNode(componentId))
    );

    res.json({
      success: true,
      project: {
        ...project.toObject(),
        component: componentTrees,
      },
    });
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
