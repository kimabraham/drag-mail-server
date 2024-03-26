const Node = require("../models/Node");

exports.modifyNode = async (req, res, next) => {
  try {
    const {
      body: {
        data: { nodeId, props, style, inner },
      },
    } = req;

    const newNode = await Node.findOneAndUpdate(
      { nodeId },
      {
        props,
        style,
        inner,
      },
      { new: true }
    );

    return res.json({ success: true, node: newNode });
  } catch (error) {
    next(error);
  }
};

exports.removeBlockNode = async (req, res, next) => {
  try {
    const {
      body: {
        id,
        children: [{ nodeId, tag, className, style, children }],
      },
    } = req;
    const defaultNode = await Node.create({
      nodeId,
      tag,
      className,
      style,
      children,
      parent: id,
    });
    await Node.findByIdAndUpdate(id, {
      children: [defaultNode],
    });
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
