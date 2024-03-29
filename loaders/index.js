const mongooseLoader = require("./mongoose");
const expressLoader = require("./express");
const routerLoader = require("./routers");
const errorHandlerLoader = require("./errorHandler");

const appLoader = async (app) => {
  await expressLoader(app);
  await mongooseLoader();
  await routerLoader(app);
  await errorHandlerLoader(app);
};

module.exports = appLoader;
