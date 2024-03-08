const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: String,
  component: [
    {
      type: Object,
      required: true,
    },
  ],
  contacts: {
    type: mongoose.Types.ObjectId,
    ref: "Contact",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Project", projectSchema);
