const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  component: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Node",
    },
  ],
  contacts: {
    type: mongoose.Types.ObjectId,
    ref: "Contact",
  },
  creator: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
