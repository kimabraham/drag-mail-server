const Contact = require("../models/Contact");
const User = require("../models/User");

exports.updateContact = async (req, res, next) => {
  try {
    const {
      user,
      params: { id },
      body: { name, email },
    } = req;
    const contactExists = user.contacts.some(
      (contactId) => contactId.toString() === id
    );

    if (!contactExists) {
      return res
        .status(404)
        .send({ message: "Contact not found in user's contacts" });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );

    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    const {
      user,
      params: { id },
    } = req;

    const contactExists = user.contacts.some(
      (contactId) => contactId.toString() === id
    );

    if (!contactExists) {
      return res
        .status(404)
        .send({ message: "Contact not found in user's contacts" });
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { contacts: id },
    });
    await Contact.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
