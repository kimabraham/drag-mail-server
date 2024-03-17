const Node = require("../models/Node");

exports.saveNodeRecursive = async (nodeData, parentId = null) => {
  try {
    const newNode = new Node({
      nodeId: nodeData.nodeId,
      tag: nodeData.tag,
      className: nodeData.className,
      inner: nodeData.inner,
      props: nodeData.props || {},
      style: nodeData.style || {},
      parent: parentId,
      children: [],
    });

    const savedNode = await newNode.save();

    if (
      nodeData.tag !== "img" &&
      nodeData.children &&
      nodeData.children.length > 0
    ) {
      const childIds = [];
      for (const childNodeData of nodeData.children) {
        const childNode = await exports.saveNodeRecursive(
          childNodeData,
          savedNode._id
        );
        childIds.push(childNode._id);
      }

      savedNode.children = childIds;
      await savedNode.save();
    }

    return savedNode;
  } catch (error) {
    throw error;
  }
};

exports.collectAllChildNodeIds = async (nodeId) => {
  const node = await Node.findById(nodeId);
  if (!node) return [];

  let ids = [node._id];
  for (const childId of node.children) {
    const childNodeIds = await exports.collectAllChildNodeIds(childId);
    ids = ids.concat(childNodeIds);
  }
  return ids;
};

exports.convertDbToNode = async (nodeId) => {
  const node = await Node.findById(nodeId);
  if (!node) return null;

  const children = await Promise.all(
    node.children.map((childId) => exports.convertDbToNode(childId))
  );

  return {
    id: node._id,
    nodeId: node.nodeId,
    tag: node.tag,
    className: node.className,
    inner: node.inner,
    props: node.props,
    style: node.style,
    children: children,
    parent: node.parent,
  };
};

exports.findNodeByClassName = async (nodeId, className) => {
  const node = await Node.findById(nodeId).populate("children");
  if (!node) return null;

  if (node.className === className) {
    return node;
  }

  for (const child of node.children) {
    const found = await exports.findNodeByClassName(child._id, className);
    if (found) return found;
  }

  return null;
};
