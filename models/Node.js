const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  inner: {
    type: String,
  },
  className: {
    type: String,
    required: true,
  },
  props: {
    type: Object,
    required: true,
    default: {},
  },
  style: {
    type: Object,
    required: true,
    default: {},
  },
  children: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Node",
      },
    ],
    required: true,
    default: [],
  },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: "Node",
  },
});

module.exports = mongoose.model("Node", nodeSchema);
