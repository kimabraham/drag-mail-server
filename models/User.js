const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  contacts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Contact",
    },
  ],
  projects: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Project",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
