require("../utils/passport");
const Joi = require("joi");
const User = require("../models/User");
const Project = require("../models/Project");
const Contact = require("../models/Contact");

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
exports.getUserContacts = async (req, res, next) => {
  try {
    const {
      user: { _id },
    } = req;
    const currentUser = await User.findById(_id).populate({ path: "contacts" });
    const contacts = currentUser.contacts;

    res.json({ success: true, contacts });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.createUserContact = async (req, res, next) => {
  try {
    const {
      user: { _id },
      body,
    } = req;

    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
    });

    const {
      value: { name, email },
      error,
    } = schema.validate(body);

    if (error) {
      throw Error(error.details[0].message);
    }

    const contact = await Contact.create({
      name,
      email,
    });

    await User.findByIdAndUpdate(_id, {
      $push: { contacts: contact._id },
    });

    res.json({ success: true, contact });
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
