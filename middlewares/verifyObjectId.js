const { isValidObjectId } = require("mongoose");

exports.verifyObjectId = (req, res, next) => {
  try {
    const {
      params: { id },
    } = req;

    if (isValidObjectId(id)) {
      next();
    } else {
      throw Error("Id is not objectID");
    }
  } catch (error) {
    next(error);
  }
};
